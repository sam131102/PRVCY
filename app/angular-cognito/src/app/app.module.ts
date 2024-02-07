import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SupportComponent } from './support/support.component';
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
import { ChatbotComponent } from './chatbot/chatbot.component'


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
    ChatbotComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCommonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    NgIconsModule.withIcons({matHideSourceOutline, matCircleOutline}),
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    

  ],
  providers: [
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
