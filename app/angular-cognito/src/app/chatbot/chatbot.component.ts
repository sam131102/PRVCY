import { Component } from '@angular/core';
import { ChatbotService } from '../chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  userInput: string = '';
  messages: string[] = [];

  constructor(private chatbotService: ChatbotService) {}

  sendMessage(): void {
    if (this.userInput.trim() !== '') {
      this.messages.push('You: ' + this.userInput);
      const topicArn = 'arn:aws:sns:ca-central-1:952490130013:prvcy';
      this.chatbotService.sendMessage(this.userInput, topicArn)
        .then(response => {
          this.messages.push('Chatbot: ' + response.MessageId);
        })
        .catch(error => {
          console.error('Error sending message:', error);
          this.messages.push('Error sending message: ' + error.message);
        });
      this.userInput = '';
    }
  }
}  