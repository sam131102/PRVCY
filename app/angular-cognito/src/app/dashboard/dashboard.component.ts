import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Router } from '@angular/router';

import { IUser, CognitoService} from '../cognito.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading: boolean;
  user: IUser;
  isAuthenticated: boolean;

  constructor(private router: Router, private cognitoService: CognitoService, public dialog: MatDialog) {
    this.loading = false;
    this.user = {} as IUser;
    this.isAuthenticated = true;
  }
  showJoinForm = false;

  public ngOnInit(): void {
    this.cognitoService.getUser()
    .then((user: any) => {
      this.user = user.attributes;
    });
    if (this.user['custom:organization'] == null || this.user['custom:organization'] == 'default') {
      this.showJoinForm = true;
    } else {
      this.showJoinForm = false;
    }
    
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
  openDialog(): void {
    this.dialog.open(DialogComponent)
  }

}
