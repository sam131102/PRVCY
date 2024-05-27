import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SupportComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoRecorderComponent } from './video-recorder/video-recorder.component';
import { InboxComponent } from './inbox/inbox.component';
import { OrganizationPageComponent } from './organization-page/organization-page.component';
import { ShareVideoComponent } from './share-video/share-video.component';
import { VideoListComponent } from './video-list/video-list.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'signIn',
    pathMatch: 'full',
  },
  {
    path: 'video-list',
    component: VideoListComponent,
  }, 
{
  path: 'share-video',
  component: ShareVideoComponent,
}, 
  {
    path: 'video-recorder',
    component: VideoRecorderComponent,
    
  }, 
  {
    path: 'organizationPage',
    component: OrganizationPageComponent,
  },
  {
    path: 'inbox',
    component: InboxComponent,
  },
  {
    path: 'support',
    component: SupportComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'signIn',
    component: SignInComponent,
  },
  {
    path: 'signUp',
    component: SignUpComponent,
  },
  {
    path: '**',
    redirectTo: 'signIn',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
