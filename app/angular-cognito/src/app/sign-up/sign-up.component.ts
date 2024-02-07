// sign-up.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { IUser, CognitoService } from '../cognito.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  loading: boolean;
  user: IUser;
  hide = true;
  durationInSeconds = 5;

  constructor(private router: Router, private cognitoService: CognitoService, private snackBar: MatSnackBar) {
    this.loading = false;
    this.user = {} as IUser;

    
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  password = new FormControl('', {
    validators: [Validators.required, Validators.pattern(this.StrongPasswordRegx)],
  })

  getPasswordErrorMessage(){
    if(this.password.hasError('required')){
      return 'You must enter a value';
    }
    return this.password.hasError('pattern') ? 'Password must contain an uppercase, lowercase and special character':'';
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


   public signUp(username: string, organization: string): void {
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
  
    this.cognitoService.signUp(this.user)
      .then(() => {
        this.createS3UserFolder(username);
        this.router.navigate(['/signIn']).then(()=>{
          this.snackBar.open("Successfully registered", "Dismiss",{duration: 5000})
        })
      })
      .catch((error) => {
        console.error('Sign Up Error:', error);
        this.loading = false;
      });
  }
  
  private createS3UserFolder(username: string): void {
    const folderKey = `${username}/`;
    this.cognitoService.checkS3UserFolder(folderKey)
      .then(folderExists => {
        if (!folderExists) {
          this.cognitoService.createS3UserFolder(folderKey)
            .then(() => console.log('User folder created successfully in S3'))
            .catch(err => console.error('Error creating user folder in S3:', err));
        }
      })
      .catch(err => console.error('Error checking user folder in S3:', err));
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
}
