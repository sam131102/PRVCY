import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { IUser, CognitoService } from './cognito.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as AWS from 'aws-sdk';
import { VideoMetadata } from './video-metadata.model';

@Injectable({
  providedIn: 'root'
})
export class VideoListingService {
  loading: boolean;
  user: IUser;
  isAuthenticated: boolean;
  private s3: AWS.S3;

  constructor(private cognitoService: CognitoService, private router: Router) {
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

  private extractVideoName(videoKey: string): string {
    const parts = videoKey.split('-');
    if (parts.length > 1) {
      return parts.slice(1).join('-'); // Re-join the parts to account for names with '-'
    }
    return videoKey; // Fallback to the original key if the expected '-' is not found
  }
  
  private extractVideoDate(videoKey: string, timestampFromMetadata: number): string {
    let timestamp = timestampFromMetadata || 0; 
    if (timestamp) {
      const dateObj = new Date(timestamp);
      const formattedDate = `${dateObj.getUTCFullYear()}-${this.padZero(dateObj.getUTCMonth() + 1)}-${this.padZero(dateObj.getUTCDate())} ${this.padZero(dateObj.getUTCHours())}:${this.padZero(dateObj.getUTCMinutes())}:${this.padZero(dateObj.getUTCSeconds())}`;
      return formattedDate;
    } else {
      console.error('Invalid timestamp:', timestamp);
      return '';
    }
  }
  
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }  
  
  getVideos(): Observable<VideoMetadata[]> {
    return from(this.cognitoService.getUsername() as Promise<string>).pipe(
      switchMap(username => {
        if (!username) {
          console.error('User information not available.');
          return of([]);
        }
  
        const prefix = `${username}-`;
        return from(
          this.s3.listObjectsV2({
            Bucket: 'rekognitionvideofaceblurr-outputimagebucket1311836-k4clgp1hsh27',
            Prefix: prefix
          }).promise()
        ).pipe(
          map((data: AWS.S3.ListObjectsV2Output) => {
            if (!data || !data.Contents) {
              console.error('No data or Contents in S3 response.');
              return [];
            }
  
            return data.Contents
              .filter((item: AWS.S3.Object) => item.Key && item.Key.endsWith('.mp4'))
              .map((item: AWS.S3.Object) => {
                const videoKey = item.Key || '';
                const videoName = this.extractVideoName(videoKey);
                const timestampFromMetadata = item.LastModified?.getTime() || 0;
                const videoDate = this.extractVideoDate(videoKey, timestampFromMetadata);
                return {

                  key: videoKey,
                  name: videoName,
                  date: videoDate,
                  creator: username,
                };
              });
          }),
          catchError(error => {
            console.error('Error fetching videos from S3:', error);
            return of([]);
          })
        );
      })
    );
  }
}