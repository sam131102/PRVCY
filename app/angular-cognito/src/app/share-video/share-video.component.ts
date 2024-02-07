import { Component, OnInit } from '@angular/core';
import { CognitoService, IUser } from '../cognito.service';
import { VideoListingService } from '../video-listing.service';
import { VideoMetadata } from '../video-metadata.model';
import { SNS } from 'aws-sdk';
import { Router } from '@angular/router';

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

  constructor(
    private VideoListingService: VideoListingService,
    private cognitoService: CognitoService,
    private router: Router
  ) {
    this.sns = new SNS();
   }

  ngOnInit() {
    this.fetchContactList();
    this.loadMostRecentVideo();
  }

  async fetchContactList() {
    try {
      const usernames = await this.cognitoService.getContactListFromS3();
      const ownUsername = await this.cognitoService.getUsername();
      const filteredUsernames = usernames.filter(username => username !== ownUsername);
      
      this.contactList = filteredUsernames;
    } catch (error) {
      console.error('Error fetching usernames from S3:', error);
    }
  }
  

  loadMostRecentVideo(): void {
    this.VideoListingService.getVideos().subscribe(
      (videos: VideoMetadata[]) => {
        console.log('Videos:', videos);
        videos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.recentVideo = videos[0];
      },
      error => {
        console.error('Error fetching videos:', error);
      }
    );
  }
  
  
  getVideoUrl(videoKey: string): string {
    return `https://prvcy-storage-ba20e15b50619-staging.s3.amazonaws.com/${videoKey}`;
  }

  sendVideoToContact(contact: any) {
    if (this.recentVideo) {
      const sourceKey = this.recentVideo.key;
      console.log('Source Key:', sourceKey);
  
      this.cognitoService.copyVideoToContactFolder(sourceKey, contact).then(
        async () => {
          console.log(`Video successfully sent`);
          await this.sendMessageToUser(contact, 'Your new video has been sent!');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error(`Error sending video to ${contact}:`, error);
        }
      );
    }
  }  

  async sendMessageToUser(userEmail: string, message: string): Promise<void> {
    try {
      const params = {
        Message: message,
        Subject: 'New Video Sent',
        TopicArn: 'arn:aws:sns:ca-central-1:952490130013:prvcy',
        MessageAttributes: {
          email: {
            DataType: 'String',
            StringValue: userEmail
          }
        }
      };
  
      // Send message to SNS
      await this.sns.publish(params).promise();
      
      console.log(`Message sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
}  