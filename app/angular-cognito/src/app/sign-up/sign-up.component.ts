// sign-up.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { IUser, CognitoService } from '../cognito.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { signup } from './signup';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signup: signup[] = [];
  sign: signup = {email: '', username:'', password:'', firstname:'', lastname:'',birthdate:'', organizationcode:'', accounttype:'',  preferred_username:''};
  loading: boolean;
  user: IUser;
  hide = true;
  durationInSeconds = 5;

  constructor(private router: Router, private cognitoService: CognitoService, private snackBar: MatSnackBar, private signUpService: SignupService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  ngOnInit(): void {
      this.getSignup();
  }

  getSignup(): void{
    this.signUpService.getAll().subscribe(
      (data: signup[])=>{
        this.signup = data;
      }
    )

  }

  email = new FormControl('', [Validators.required, Validators.email]);
  StrongPasswordRegx: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  password = new FormControl('', {
    validators: [Validators.required, Validators.pattern(this.StrongPasswordRegx), Validators.minLength(8)],
  })

  getPasswordErrorMessage(){
    if(this.password.hasError('required')){
      return 'You must enter a value';
    }if(this.password.hasError('minlength')){
      return 'Must be 8 characters';
    }
    return this.password.hasError('pattern') ? 'Password must contain an uppercase, number and special character':'';
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

   public signUp(username: string, organization: string, f: NgForm): void {
    this.loading = true;

    var bdate = this.user.birthdate.toString();
    var split = bdate.split(' ', 4)
    
    switch (split[1].toString().toLowerCase()) {
      case 'jan':
        split[1] = '01';
        break;
      case 'feb':
        split[1] = '02';
        break;
      case 'mar':
        split[1] = '03';
        break;
      case 'apr':
        split[1] = '04';
        break;
      case 'may':
        split[1] = '05';
        break;
      case 'jun':
        split[1] = '06';
        break;
      case 'jul':
        split[1] = '07';
        break;
      case 'aug':
        split[1] = '08';
        break;
      case 'sep':
        split[1] = '09';
        break;
      case 'oct':
        split[1] = '10';
        break;
      case 'nov':
        split[1] = '11';
        break;
      case 'dec':
        split[1] = '12';
        break;
      default:
        split[1] = 'Invalid Month';
        break;
    }
    
    this.user.birthdate = split[3] + "-" + split[1] + "-" + split[2]

    if (organization == null) {
      this.user['custom:organization'] = 'default';
    }
    this.user.username = username;
    this.user['custom:avatar_num'] = 0;
    this.sign = {email: this.user.email, username:this.user.username, password:this.user.password, 
      firstname:this.user.given_name, lastname:this.user.family_name,birthdate:this.user.birthdate,
       organizationcode:this.user['custom:organization'],accounttype:this.user['custom:account_type'], 
       preferred_username: this.user['custom:preferred_username']};
    this.signUpService.store(this.sign).subscribe(
      (res: signup)=>{
        this.signup.push(res)
      }
    )

    this.cognitoService.signUp(this.user)
      .then(() => {
        this.createS3CaptionFolder(this.user.username);
        this.subscribeUserToSnsTopic(this.user.email);
        console.log("Test Case 1: Success Sign Up");
        this.router.navigate(['/signIn']).then(()=>{
          this.snackBar.open("Successfully registered", "Dismiss",{duration: 5000})
        })
      })
    .catch((error) => {
        console.error('Sign Up Error:', error);
        this.loading = false;
      });
  }
  

  private createS3CaptionFolder(username: string): void {
    const folderKey = `${username}-captions/`;
    this.cognitoService.checkS3CaptionsFolder(folderKey)
      .then(folderExists => {
        if (!folderExists) {
          this.cognitoService.createS3CaptionsFolder(folderKey)
            .then(() => console.log('User caption folder created successfully in S3'))
            .catch(err => console.error('Error creating user caption folder in S3:', err));
        }
      })
        .catch(err => console.error('Error checking user caption folder in S3:', err));
  }

  public confirmSignUp(): void {
    this.loading = true;
    this.cognitoService.confirmSignUp(this.user)
      //I'm not entirely sure this part of the code is accessed at all
      .then((confirmationResult) => {
        console.log('Confirmation result:', confirmationResult);
        
        this.router.navigate(['/signIn'])
      })
      .catch((error) => {
        console.error('Confirm Sign Up Error:', error);
        this.loading = false;
      });
  }
  public subscribeUserToSnsTopic(userEmail: string): void {
    const topicArn = 'arn:aws:sns:ca-central-1:952490130013:prvcy';
    this.cognitoService.subscribeUserToSnsTopic(userEmail, topicArn)
      .then(() => console.log('User subscribed to SNS topic'))
      .catch((error) => console.error('Error subscribing user to SNS topic:', error));
  }
  
}