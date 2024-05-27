import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SupportComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoRecorderComponent } from './video-recorder/video-recorder.component';
import { InboxComponent } from './inbox/inbox.component';
import { OrganizationPageComponent } from './organization-page/organization-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './dialog/dialog.component';
import { MatCommonModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ShareVideoComponent } from './share-video/share-video.component';
import { VideoListComponent } from './video-list/video-list.component';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {MatIcon, MatIconModule} from '@angular/material/icon'
import { NgIconsModule } from '@ng-icons/core';
import { matHideSourceOutline, matCircleOutline } from '@ng-icons/material-icons/outline';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule  } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    SignInComponent,
    SignUpComponent,
    SupportComponent,
    DashboardComponent,
    VideoRecorderComponent,
    InboxComponent,
    OrganizationPageComponent,
    DialogComponent,
    ShareVideoComponent,
    VideoListComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCommonModule,
    MatDialogModule,
    MatCommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    NgIconsModule.withIcons({matHideSourceOutline, matCircleOutline}),
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    HttpClientModule,
    MatButtonToggleModule,
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
