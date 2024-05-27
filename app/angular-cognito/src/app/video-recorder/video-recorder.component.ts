
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { IUser, CognitoService } from '../cognito.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import * as AWS from 'aws-sdk';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { integer } from 'aws-sdk/clients/cloudfront';

import { videodata } from './video-data';
import { VideoDataService } from './video-data.service';
import { TranscriptionConfiguration } from 'aws-sdk/clients/chime';

export interface DialogData {
  animal: string;
  name: string;
}



@Component({
  selector: 'app-video-recorder',
  templateUrl: './video-recorder.component.html',
  styleUrls: ['./video-recorder.component.scss'],
})

export class VideoRecorderComponent implements AfterViewInit, OnDestroy {

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  
  playbackDisabled: boolean = true;
  submitDisabled: boolean = true;
  recordAgain: boolean = true;
  recordHidden: boolean = false;
  loading: boolean;
  user: IUser;
  isAuthenticated: boolean;

  comment: string = '';
  videoName: string = '';
  isSubmitDisabled: boolean = true;

  videoData: videodata[] = [];
  vidData: videodata = {username: '', title: '', comment: ''}

  private stream!: MediaStream;
  private kinesisVideoClient: AWS.KinesisVideo | null = null;
  private kinesisVideoStream: MediaStream | null = null;
  private kinesisVideoStreamArn: string | null = null;
  selectedFile: File | null = null;
  private s3: AWS.S3;
  private recordedChunks: Blob[] = [];
  private mediaRecorder: MediaRecorder | null = null;

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  constructor(private cognitoService: CognitoService, private router: Router, public dialog: MatDialog, private vidDataService: VideoDataService) {
    this.loading = false;
    this.user = {} as IUser;
    this.isAuthenticated = true;
    AWS.config.update({
      accessKeyId: environment.aws.accessKeyId,
      secretAccessKey: environment.aws.secretAccessKey,
      sessionToken: environment.aws.sessionToken,
      region: environment.aws.region
    });
    this.s3 = new AWS.S3();
  }

  ngAfterViewInit() {
    this.startWebcamPreview();
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  
    AWS.config.update({
      accessKeyId: environment.aws.accessKeyId,
      secretAccessKey: environment.aws.secretAccessKey,
      sessionToken: environment.aws.sessionToken,
      region: environment.aws.region
    });
  
    this.kinesisVideoClient = new AWS.KinesisVideo();
    this.createKinesisVideoStream();
  }
  ngOnDestroy() {
    this.stopCamera();
  }

  private startWebcamPreview(): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.stream = stream;
        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = stream;
        }
      })
      .catch(error => {
        console.error('Error accessing the webcam:', error);
      });
  }


  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
  
  createKinesisVideoStream() {
    const params = {
      StreamName: 'prvcy_stream',
    };
    this.kinesisVideoClient!.describeStream(params, (err: AWS.AWSError, data: AWS.KinesisVideo.DescribeStreamOutput) => {
      if (err) {
        console.error('Error describing Kinesis Video stream:', err);
      } else {
        console.log('Kinesis Video stream described successfully:', data);

        this.kinesisVideoStreamArn = data.StreamInfo?.StreamARN ?? null;

      }
    });
  }

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }
  
  errorCallback(error: any) {
    console.error('Error accessing media devices:', error);
  }

  startRecording() {
    this.recordHidden = true;
    let mediaConstraints: MediaStreamConstraints = {
      video: true,
      audio: true,
    };

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((stream: MediaStream) => this.successCallback(stream))
      .catch((error) => this.errorCallback(error));
  }

  startRecordingButtonClicked() {
    console.log("Success");
    this.playbackDisabled = true;
    this.submitDisabled = true;
    this.startRecording();
  }

  stopRecording() {
    this.recordHidden = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
    const recordedBlob = new Blob(this.recordedChunks, { type: 'video/webm' });

    this.recordedChunks = [];
    this.mediaRecorder = null;
    this.playbackDisabled = false;
    this.submitDisabled = false;
    this.recordAgain = false;
  }

  private uploadToS3(videoName: string, format: string): Promise<void> {
    const buttonPressed = document.getElementsByClassName("mat-button-toggle-button mat-focus-indicator");
    const bucketAddress = buttonPressed[0].ariaPressed === 'true' ? 'prvcy-storage-ba20e15b50619-staging' : 'rekognitionvideofaceblurr-outputimagebucket1311836-k4clgp1hsh27';
    const region = 'us-west-2';
    const encodeBool = buttonPressed[0].ariaPressed === 'true' ? true : false;
    return new Promise<void>((resolve, reject) => {
      this.cognitoService.getUsername()
        .then(username => {
          console.log('Username:', username);
          const recordedBlob = new Blob(this.recordedChunks, { type: `video/${format}` });
          this.recordedChunks = [];
  
          const key = `${username}-${videoName}.${format}`;
          const params: AWS.S3.PutObjectRequest = {
            Bucket: bucketAddress,
            Key: key,
            Body: recordedBlob,
            ContentType: `video/${format}`,
          };
          this.s3.upload(params, (uploadErr, data) => {
            if (uploadErr) {
              console.error('Error uploading to S3:', uploadErr);
              reject('Error uploading to S3.');
            } else {
              console.log('Upload to S3 successful:', data);
              this.transcriptionAndEncoding(username, videoName, key, bucketAddress, region, `${username}-${videoName}`, encodeBool);
              resolve();
            }
          });
  
        })
        .catch(error => {
          console.error('Error getting username:', error);
          reject('Error getting username.');
        });
    });
  }
  

  private uploadVideo(username: string, videoName: string, format: string, resolve: () => void, reject: (error: string) => void) {
    if (!videoName.trim()) {
      console.error('Video name cannot be empty');
      reject('Video name cannot be empty.');
      return;
    }
  
    const key = `${username}/${videoName}.${format}`;
    
  
    const recordedBlob = new Blob(this.recordedChunks, { type: `video/${format}` });
    this.recordedChunks = [];
  
    const params: AWS.S3.PutObjectRequest = {
      Bucket: 'prvcy-storage-ba20e15b50619-staging',
      Key: key,
      Body: recordedBlob,
      ContentType: `video/${format}`,
    };
  
    this.s3.upload(params, (uploadErr, data) => {
      if (uploadErr) {
        console.error('Error uploading to S3:', uploadErr);
        reject('Error uploading to S3.');
      } else {
        console.log('Upload to S3 successful:', data);
        resolve();
        }
    });
  }

  private mediaConvertCodec(key: string) {
    return new Promise<void>((resolve, reject) => {
      const { MediaConvertClient, CreateJobCommand } = require("@aws-sdk/client-mediaconvert");
      const credentials = {
        accessKeyId: environment.aws.accessKeyId,
        secretAccessKey: environment.aws.secretAccessKey,
        sessionToken: environment.aws.sessionToken
      };
      const mediaConfig = {
        region: "us-west-2",
        credentials
      }
      const input = {
      Role: "arn:aws:iam::952490130013:role/service-role/MediaConvert_Default_Role",
      Settings: {
        TimecodeConfig: {
          Source: "ZEROBASED"
        },
        OutputGroups: [
          {
            Name: "File Group",
            Outputs: [
              {
                ContainerSettings: {
                  Container: "MP4",
                  Mp4Settings: {}
                },
                VideoDescription: {
                  CodecSettings: {
                    Codec: "H_264",
                    H264Settings: {
                      MaxBitrate: 3500000,
                      RateControlMode: "QVBR",
                      SceneChangeDetect: "TRANSITION_DETECTION"
                    }
                  }
                },
                AudioDescriptions: [
                  {
                    AudioSourceName: "Audio Selector 1",
                    CodecSettings: {
                      Codec: "AAC",
                      AacSettings: {
                        Bitrate: 96000,
                        CodingMode: "CODING_MODE_2_0",
                        SampleRate: 48000
                      }
                    }
                  }
                ]
              }
            ],
            OutputGroupSettings: {
              Type: "FILE_GROUP_SETTINGS",
              FileGroupSettings: {
                Destination: "s3://rekognitionvideofaceblurr-inputimagebucket20b2ba6b-6anfoc4ah759/"
              }
            }
          }
        ],
        FollowSource: 1,
        Inputs: [
          {
            AudioSelectors: {
              "Audio Selector 1": {
                DefaultSelection: "DEFAULT"
              }
            },
            VideoSelector: {},
            TimecodeSource: "ZEROBASED",
            FileInput: `s3://prvcy-storage-ba20e15b50619-staging/${key}`
          }
        ]
      },
      BillingTagSource: "JOB",
      AccelerationSettings: {
        Mode: "DISABLED"
      },
      StatusUpdateInterval: "SECONDS_60",
      Priority: 0
      }
    
      async function convertCodec() {
        const mediaClient = new MediaConvertClient(mediaConfig);
        const mediaCommand = new CreateJobCommand(input);
      
        try {
          const mediaResponse = await mediaClient.send(mediaCommand);
          console.log("Changing codec to H.264, details are: ")
          console.log(mediaResponse.Job);
          resolve();
        } catch (err) {
          console.log(err);
          reject("Unable to change codec.");
        }
      }
      convertCodec();
    });
    
    
  }

  checkFaceBlur(key: string) {
    return new Promise<void>((resolve, reject) => {
      const { SFNClient, ListExecutionsCommand, DescribeExecutionCommand } = require("@aws-sdk/client-sfn");
      const credentials = {
          accessKeyId: environment.aws.accessKeyId,
          secretAccessKey: environment.aws.secretAccessKey,
          sessionToken: environment.aws.sessionToken
      };
      const SFNConfig = {
        region: "us-west-2",
        credentials
      };
    
      const listInput = {
        stateMachineArn: "arn:aws:states:us-west-2:952490130013:stateMachine:StateMachine2E01A3A5-QNnIzCsageEU",
        maxResults: 10
      };
      var describeInput;
      var found = false;
      const sleep = (delay: integer) => new Promise((resolve) => setTimeout(resolve, delay));
      const listCommand = new ListExecutionsCommand(listInput);
      var listResponse;
      var describeResponse;
      var done = false;
      async function check() {
        await sleep(10000);
        const stepFunctionClient = new SFNClient(SFNConfig);
        try {
          listResponse = await stepFunctionClient.send(listCommand);
          for(let i = 0; i < 1; i++) {
            describeInput = {
              executionArn: listResponse.executions[0].executionArn
            };
            var describeCommand = new DescribeExecutionCommand(describeInput);
            describeResponse = await stepFunctionClient.send(describeCommand);
            var inputArray = describeResponse.input.split(":");
            var videoNameInput = inputArray[inputArray.length - 1].split("\"");
            console.log(videoNameInput[1]);
          }
          if (videoNameInput[1] === key) {
            while (!done) {
              describeInput = {
                executionArn: listResponse.executions[0].executionArn
              };
              var describeCommand = new DescribeExecutionCommand(describeInput);
              describeResponse = await stepFunctionClient.send(describeCommand);
              if (describeResponse.status == "RUNNING") {
                done = false;
              } else if (describeResponse.status == "FAILED") {
                done = true;
                reject('Failed to blur face. Please try re-recording.');
              } else if (describeResponse.status == "SUCCEEDED") {
                done = true;
                console.log('Face has been blurred. Continuing to next page.');
                resolve();
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
        
      }
      check();
    });
    
    
  }

  async transcriptionAndEncoding(username: string, videoName: string, key: string, bucketAddress: string, region: string, transcriptionJobName: string, encodeBool: Boolean) {
    try {
      if (encodeBool) {
        await this.mediaConvertCodec(key);
        await this.checkFaceBlur(key);
        await this.transcribeUpload(username, videoName, key, "rekognitionvideofaceblurr-inputimagebucket20b2ba6b-6anfoc4ah759", region, transcriptionJobName);
        await this.checkTranscription(transcriptionJobName, region);
        await this.deleteTranscription(transcriptionJobName);
      } else {
        await this.transcribeUpload(username, videoName, key, "rekognitionvideofaceblurr-outputimagebucket1311836-k4clgp1hsh27", region, transcriptionJobName);
        await this.checkTranscription(transcriptionJobName, region);
        await this.deleteTranscription(transcriptionJobName);
      }
      
      
      
      this.router.navigate(['/share-video']);
    } catch (err) {
      console.log(err);
    }
  }
 
  private deleteTranscription(transcriptionJobName: string) {
    return new Promise<void>((resolve, reject) => {
      const { TranscribeClient, DeleteTranscriptionJobCommand } = require("@aws-sdk/client-transcribe");
      const credentials = {
        accessKeyId: environment.aws.accessKeyId,
        secretAccessKey: environment.aws.secretAccessKey,
        sessionToken: environment.aws.sessionToken
      };
      const transcribeConfig = {
        region: "us-west-2",
        credentials
      };
      const input = {
        TranscriptionJobName: transcriptionJobName
      };
      async function deleteJob() {
        try {
          const deleteClient = new TranscribeClient(transcribeConfig);
          const deleteCommand = new DeleteTranscriptionJobCommand(input);
          const response = await deleteClient.send(deleteCommand);
          console.log("Job deleted to prevent duplication. Details are: " + response);
          resolve();
        } catch (err) {
          reject(err);
        }
        
      }
      deleteJob()
    });
  }

  private transcribeUpload(username: string, videoName: string, mediaFileKey: string, bucketAddress: string, region: string, transcriptionJobName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const { TranscribeClient, StartTranscriptionJobCommand } = require("@aws-sdk/client-transcribe");
      const credentials = {
        accessKeyId: environment.aws.accessKeyId,
        secretAccessKey: environment.aws.secretAccessKey,
        sessionToken: environment.aws.sessionToken
      };
      const transcribeConfig = {
        region: "us-west-2",
        credentials
      };
      console.log(transcriptionJobName);
      const input = {
        TranscriptionJobName: transcriptionJobName,
        LanguageCode: "en-US",
        Media: {
          MediaFileUri: `s3://${bucketAddress}/${mediaFileKey}`
        },
        Subtitles: {
          Formats: [
            "vtt"
          ]
        },
        OutputBucketName: 'rekognitionvideofaceblurr-outputimagebucket1311836-k4clgp1hsh27',
        OutputKey: `${username}-captions/${videoName}-captions`
      };
      async function startTranscriptionRequest() {
        
        const transcribeClient = new TranscribeClient(transcribeConfig);
        const transcribeCommand = new StartTranscriptionJobCommand(input);
        try {
          const transcribeResponse = await transcribeClient.send(transcribeCommand);
          console.log("Transcription job created, the details:");
          console.log(transcribeResponse.TranscriptionJob);
          resolve();
        } catch(err) {
          console.log(err);
          reject('Unable to create transcription job.');
        }
      }
      startTranscriptionRequest();
    }) 
  }

  checkTranscription(transcriptionJobName: string, region: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const { TranscribeClient, GetTranscriptionJobCommand, GetTranscriptionJobResponse } = require("@aws-sdk/client-transcribe");
      const credentials = {
        accessKeyId: environment.aws.accessKeyId,
        secretAccessKey: environment.aws.secretAccessKey,
        sessionToken: environment.aws.sessionToken
      };
      const transcribeConfig = {
        region: "us-west-2",
        credentials
      };
      const input = {
        TranscriptionJobName: transcriptionJobName
      }
      console.log(input);
      var done = false;
      async function check() {
        const transcribeClient = new TranscribeClient(transcribeConfig);
        while (!done) {
          var transcribeCommand = new GetTranscriptionJobCommand(input);
          var transcribeResponse = await transcribeClient.send(transcribeCommand);
          try {
            if (transcribeResponse.TranscriptionJob.TranscriptionJobStatus === undefined) {
              done = false;
            } else if (transcribeResponse.TranscriptionJob.TranscriptionJobStatus == "IN_PROGRESS") {
              done = false;
            } else if (transcribeResponse.TranscriptionJob.TranscriptionJobStatus == "FAILED") {
              done = true;
              reject('Transcription job failed. No captions will be generated.');
            } else if (transcribeResponse.TranscriptionJob.TranscriptionJobStatus == "COMPLETED") {
              done = true;
              console.log('Transcription job finished, moving onto the next page.')
              resolve();
            }
          } catch (err) {
            console.log(err);
            continue;
          } 
        }
      }
      check();  
      });  
  }

  successCallback(stream: MediaStream) {
    this.stream = stream;

    if (this.stream && this.stream.getVideoTracks().length > 0 && this.stream.getAudioTracks().length > 0) {
      let video: HTMLVideoElement = this.video.nativeElement;
      video.srcObject = stream;
      this.toggleControls();

      this.kinesisVideoStream = new MediaStream();

      const videoTracks = this.stream.getVideoTracks();
      const audioTracks = this.stream.getAudioTracks();

      if (videoTracks.length > 0) {
        this.kinesisVideoStream.addTrack(videoTracks[0]);
      }

      if (audioTracks.length > 0) {
        this.kinesisVideoStream.addTrack(audioTracks[0]);
      }

      this.mediaRecorder = new MediaRecorder(this.kinesisVideoStream);
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        console.log('Recording stopped. Recorded chunks:', this.recordedChunks);
      };

      this.mediaRecorder.start();
      setTimeout(() => this.mediaRecorder?.stop(), 100000);
    } else {
      console.error('Error: Media stream is not available or does not have video/audio tracks.');
    }
  }

  download() {
    console.log("Success");
    const recordedBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(recordedBlob);

    downloadLink.href = url;
    downloadLink.download = 'recorded-video.webm';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
  }

  async submitVideo() {
    if (this.recordedChunks.length === 0) {
      console.error('No recorded video to submit');
      return;
    }
    if (this.videoName.trim() === '') {
      console.error('Video name cannot be empty');
      return;
    }

    try {
      this.vidData = {username: (await this.cognitoService.getUsername()).toString(), title: this.videoName, comment: this.comment};
      this.vidDataService.store(this.vidData).subscribe(
        (res: videodata)=>{
          this.videoData.push(res)
        }
      )     
      await this.uploadToS3(this.videoName.trim(), 'mp4');
      this.videoName = '';
      this.isSubmitDisabled = true;
    } catch (error) {
      console.error('Error during S3 upload:', error);
    }
  }

  onVideoNameChange() {
    this.isSubmitDisabled = this.videoName.trim() === '';
  }

  addCommentToVideo(){

  }

  playback(){
    console.log("Success");
    if (this.recordedChunks.length > 0) {
      const recordedBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const playbackBlobURL = URL.createObjectURL(recordedBlob);
      let newvideo: HTMLVideoElement = this.video.nativeElement;
      window.open(playbackBlobURL, '_blank');
    }
    else {
      console.error("No recorded video available for playback");
    } 
  }
  animal: string | undefined;
  name: string | undefined;

  openDialog(): void {
    this.dialog.open(DialogOverviewExampleDialog);
  }

}

export class DialogOverviewExampleDialog {
  
}