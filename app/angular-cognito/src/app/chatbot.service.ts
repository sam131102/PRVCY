import { Injectable } from '@angular/core';
import { SNS } from 'aws-sdk';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
    private sns: SNS;

  constructor() {
    this.sns = new SNS({ 
      region: environment.aws.region,
      credentials: {
        accessKeyId: environment.aws.accessKeyId,
        secretAccessKey: environment.aws.secretAccessKey,
        sessionToken: environment.aws.sessionToken
      }
    });
  }

  sendMessage(message: string, topicArn: string): Promise<any> {
    const params = {
      Message: message,
      TopicArn: topicArn
    };

    return this.sns.publish(params).promise();
  }
}