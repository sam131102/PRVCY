import { Component, OnInit } from '@angular/core';
import { VideoListingService } from '../video-listing.service';
import { CognitoService, IUser } from '../cognito.service';
import { VideoMetadata } from '../video-metadata.model';
import { SNS } from 'aws-sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  videos: VideoMetadata[] = [];
  accountType: string | undefined;
  contactList: any[] = [];
  selectedContact: any;  
  private sns: SNS;

  constructor(
    private VideoListingService: VideoListingService,
    private cognitoService: CognitoService,
    private router: Router
  ) { 
    this.sns = new SNS();
  }

  ngOnInit(): void {
    this.loadVideos();
    this.loadAccountType();
    this.fetchContactList();
  }

  loadVideos(): void {
    this.VideoListingService.getVideos().subscribe(
      (videos: VideoMetadata[]) => {
        console.log('Videos:', videos);
        this.videos = videos;
      },
      error => {
        console.error('Error fetching videos:', error);
      }
    );
  }

  loadAccountType(): void {
    this.cognitoService.getAccountType().then((accountType) => {
      this.accountType = accountType;
    });
  }

  getVideoUrl(videoKey: string): string {
    return `https://prvcy-storage-ba20e15b50619-staging.s3.amazonaws.com/${videoKey}`;
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

  sendSelectedVideosToContact(contact: any): void {
    const selectedVideos = this.videos.filter(video => video.isSelected);
  
    if (selectedVideos.length > 0) {
      const sourceKeys = selectedVideos.map(video => video.key);
      console.log('Source Keys:', sourceKeys);
      const sendPromises: Promise<void>[] = [];
  
      sourceKeys.forEach(sourceKey => {
        const sendPromise = this.cognitoService.copyVideoToContactFolder(sourceKey, contact).then(
          () => {
            console.log(`Video successfully sent`);
            return this.sendMessageToUser(contact, 'Your new video has been sent!');
          },
          (error) => {
            console.error(`Error sending video:`, error);
          }
        );
  
        sendPromises.push(sendPromise);
      });
  
      Promise.all(sendPromises).then(() => {
        console.log('All videos sent successfully');
        this.router.navigate(['/dashboard']);
      }).catch(error => {
        console.error('Error sending videos:', error);
      });
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
  
      await this.sns.publish(params).promise();
      
      console.log(`Message sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}