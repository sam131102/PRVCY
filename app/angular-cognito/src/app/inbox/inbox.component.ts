import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../cognito.service';
import { Router } from '@angular/router';

interface PendingRequest {
  success: boolean;
  data: any[];
}

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  pendingRequests: PendingRequest = { success: false, data: [] };
  loading: boolean = true;

  constructor(private cognitoService: CognitoService, private router: Router) { 
  }

  ngOnInit(): void {
      this.loadPendingRequests();
  }

  async loadPendingRequests(): Promise<void> {
    const userId = await this.cognitoService.getUsername();
    this.cognitoService.fetchPendingShareRequests(userId).subscribe({
      next: (response: any) => {
        const requests: PendingRequest = response;
        console.log('Pending Requests:', requests);
        this.pendingRequests = requests;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching pending share requests:', error);
        this.loading = false;
      }
    });
  }


  respondToRequest(requestId: string, action: 'accept' | 'deny'): void {
    console.log("respondtoRequest Success");
    this.cognitoService.respondToShareRequest(+requestId, action).subscribe({
      next: () => {
        console.log(`Request ${action} successfully.`);
        if (action === 'accept') {
          const requestData = this.pendingRequests.data.find((request: any) => request.id === requestId);
          if (requestData) {
            this.cognitoService.copyVideoToContactFolder(requestData.video_key, requestData.receiver_id)
            .then(() => {
              console.log('Data copied successfully.');
              this.router.navigate(['/video-list']);
              //this.loadPendingRequests();
            })
              .catch((error) => console.error('Error copying data:', error));
          }
        }
        this.loadPendingRequests();
      },
      error: (error: any) => console.error('Error responding to request:', error)
    });
  }
  
  removeFolderName(videoKey: string): string {
    console.log("removeFolderName Success");
    return videoKey.split('/')[1];
  }
  
}
