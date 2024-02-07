import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotService } from './chatbot.service';

import { CognitoService, IUser } from './cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isAuthenticated: boolean;
  user: IUser;

  constructor(private router: Router,
    private cognitoService: CognitoService,
    private chatbotService: ChatbotService) {
    this.isAuthenticated = false;
    this.user = {} as IUser;
  }

  public ngOnInit(): void {
    this.cognitoService.getUser()
    this.cognitoService.isAuthenticated()
    .then((success: boolean) => {
      this.isAuthenticated = success;
    });
    this.cognitoService.getUser()
    .then((user: any) => {
      this.user = user.attributes;
    });
  }

  public signOut(): void {
    this.cognitoService.signOut()
  }

}