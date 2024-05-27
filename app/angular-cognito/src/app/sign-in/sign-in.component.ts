import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, CognitoService } from '../cognito.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {

  loading: boolean;
  user: IUser;
  errorMessage: string = '';
  successMessage: string = '';
  hide = true;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public signIn(): void {
    if (!this.user.email || !this.user.password) {
      this.errorMessage = 'Email and password are required';
      this.loading = false;
      return;
    }
    else{
      this.loading = true;
      this.cognitoService.signIn(this.user)
      .then(() => {
        this.router.navigate(['/dashboard']);
        this.successMessage = 'Success';
      }).then(()=>{
        window.location.reload();
      }).catch(() => {
        this.loading = false;
        this.errorMessage = 'Incorrect email or password';
      });
    }
  }
}