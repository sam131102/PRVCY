import { Component, OnInit } from '@angular/core';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import { IUser, CognitoService } from '../cognito.service';
import { ProfileUpdateService } from './profile-update-service';
import { profile } from './profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  loading: boolean;
  user: IUser;
  profile: profile = {organizationcode:'', username:''};


  constructor(private cognitoService: CognitoService, private profileUpdateService: ProfileUpdateService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public ngOnInit(): void {
    this.cognitoService.getUser()
    .then((user: any) => {
      this.user = user.attributes;
      console.log(this.user);
    });
  }

  updateDb(org: string){
    if(!org){
      console.log("Test Case 2: Empty String");
    }
    console.log("Test Case 1: Success");
    this.cognitoService.getUser()

    .then((user: any) => {
      user['custom:organization'] = org
      this.cognitoService.updateUser(this.user);
      
      this.profileUpdateService
      .update({organizationcode: org, username: user.username}).subscribe(
        (res)=>{
          console.log("Success")  
        }
      );
      
    });

  }

  public update(): void {
    this.loading = true;
    this.cognitoService.updateUser(this.user)
    .then(() => {
      this.loading = false;
      console.log("Cognito user updated successfully.")
    }).catch(() => {
      this.loading = false;
    });
  }

  public updateProfileIcon(attribValue: any): void {
    this.loading = true;
    this.cognitoService.updateProfileIcon(attribValue + "")
    .then(() => {
      this.loading = false;
      console.log('Updated Pfp')
    }).catch(() => {
      this.loading = false;
    })
  }

  public getProfileIcon(): void {
    var avatar_num = this.user['custom:avatar_num'];
    var image = document.getElementById("imageId");
    if (avatar_num == undefined) {
      (image! as HTMLImageElement).src = "../../assets/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg";
    } else if (avatar_num == 1) {
      (image! as HTMLImageElement).src = "../../assets/avatar-profile-icon-male-faceless-user-on-colorful-vector-18337859-ezgif.com-webp-to-jpg-converter.jpg";
    } else if (avatar_num == 2) {
      (image! as HTMLImageElement).src = "../../assets/female-avatar-profile-icon-round-african-american-vector-18307259-ezgif.com-avif-to-png-converter.png";
    } else if (avatar_num == 3) {
      (image! as HTMLImageElement).src = "../../assets/male-avatar-profile-icon-round-man-face-vector-18307244-ezgif.com-webp-to-jpg-converter.jpg";
    }
  }
}

