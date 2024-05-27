import { Component, OnInit } from '@angular/core';
import { CognitoService, IUser } from '../cognito.service';
import { VideoListingService } from '../video-listing.service';
import { VideoMetadata } from '../video-metadata.model';
import { SNS } from 'aws-sdk';
import { Router } from '@angular/router';
import { videolist } from '../video-list/videolist';
import { VideoListService } from '../video-list/videolist.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-video-sharing',
  templateUrl: './share-video.component.html',
  styleUrls: ['./share-video.component.scss']
})

export class ShareVideoComponent implements OnInit {
  contactList: any[] = [];
  selectedContact: any;  
  recentRecordedVideo: string = '';
  recentVideo: VideoMetadata | null = null;
  private sns: SNS;
  IUser: IUser;
  user: videolist = {username: '', organizationcode: ''};

  constructor(
    private VideoListingService: VideoListingService,
    private cognitoService: CognitoService,
    private router: Router,
    private VideoListService: VideoListService,
    private dialog: MatDialog,
  ) {
    this.IUser = {} as IUser; 
    this.sns = new SNS();
   }

   ngOnInit(): void {
    this.cognitoService.getUser()
    .then((IUser: any) => {
      this.IUser = IUser.attributes;
    }).then(()=>{
      this.fetchContactList();
    })

    this.loadMostRecentVideo();
  }

  fetchContactList() {
    try {
      console.log(this.IUser.username);
      console.log("Success");
      this.user = {username: this.IUser.username, organizationcode: this.IUser['custom:organization']};
      this.VideoListService.getAll(this.user).subscribe(
        (data: videolist[])=>{
          this.contactList = data;
        }
      )
    } catch (error) {
      console.error('Error fetching usernames from S3:', error);
    }
  }

  loadMostRecentVideo(): void {
    this.VideoListingService.getVideos().subscribe(
      (videos: VideoMetadata[]) => {
        console.log('Videos:', videos);
        videos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        for(let i = 0; i < videos.length; i++) {
          var splitArray = videos[i].name.split(".");
          if (splitArray[1] == "mp4") {
            this.recentVideo = videos[i];
            break;
          } else {
            continue;
          }
        }
        //this.recentVideo = videos[0];
      },
      error => {
        console.error('Error fetching videos:', error);
      }
    );
  }
  

  getVideoUrl(videoKey: string): string {
    return `https://rekognitionvideofaceblurr-outputimagebucket1311836-k4clgp1hsh27.s3.amazonaws.com/${videoKey}`;
  }

  getCaptionsUrl(videoKey: string): string {
    const array = videoKey.split("-");
    const videoKeyFile = array[1].substring(0, array[1].length - 4) + "-captions.vtt";
    const videoKeyFolder = array[0] + "-captions";
    console.log("Captions file information: " + videoKeyFile + " and folder: " + videoKeyFolder);
    return `https://rekognitionvideofaceblurr-outputimagebucket1311836-k4clgp1hsh27.s3.amazonaws.com/${videoKeyFolder}/${videoKeyFile}`;
  }

  async sendVideoToContact(contactUsername: any) {
    if (this.recentVideo) {
      const sourceKey = this.recentVideo.key;
      console.log('Source Key:', sourceKey);
      const senderId = await this.cognitoService.getUsername();
      
      this.cognitoService.sendShareRequest(senderId, contactUsername, sourceKey).subscribe(
        async () => {
          console.log(`Share request for video ${sourceKey} successfully sent to ${contactUsername}`);
          await this.sendMessageToUser(contactUsername, 'A new video share request has been sent to you!');
          this.openConfirmationDialog();
        },
        (error) => {
          console.error(`Error sending share request to ${contactUsername}:`, error);
        }
      );
    }
  }

  openConfirmationDialog() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
  }
  

  async sendMessageToUser(userEmail: string, message: string): Promise<void> {
    if (!userEmail || typeof userEmail !== 'string' || userEmail.trim() === '') {
      console.error('Invalid or empty userEmail provided:', userEmail);
      throw new Error('Invalid or empty userEmail provided');
    }
  
    try {
      const params = {
        Message: message,
        Subject: 'New Video Sent',
        TopicArn: 'arn:aws:sns:ca-central-1:952490130013:prvcy',
        MessageAttributes: {
          email: {
            DataType: 'String',
            StringValue: userEmail,
          },
        },
      };
  
      await this.sns.publish(params).promise();
  
      console.log(`Message sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
  
}  