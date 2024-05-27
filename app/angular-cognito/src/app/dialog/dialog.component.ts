import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Router } from '@angular/router';

import { IUser, CognitoService} from '../cognito.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  loading: boolean;
  user: IUser;
  isAuthenticated: boolean;

  constructor(private router: Router, private cognitoService: CognitoService, public dialog: MatDialog) {
    this.loading = false;
    this.user = {} as IUser;
    this.isAuthenticated = true;
  }


  public joinOrg(orgCode: string): void{
    console.log("joinOrg Success");
    this.loading = true;
    this.cognitoService.updateUserAttribute(orgCode)
    .then(() =>{
      this.loading=false
    }).then(()=>{
      window.location.reload();
    }).catch(()=>{
      this.loading = false;
    })
  
  }

  public closeDialog(){
    this.dialog.closeAll();
  }

}
