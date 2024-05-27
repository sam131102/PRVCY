import { VideoListingService } from 'src/app/video-listing.service';
import { CognitoService } from 'src/app/cognito.service';
import { VideoListService } from 'src/app/video-list/videolist.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VideoListComponent } from '../src/app/video-list/video-list.component';
import { describe, it, expect, beforeEach, vi} from 'vitest';

describe('VideoListComponent', () => {
  let component: VideoListComponent;
  let mockVideoListingService;
  let mockCognitoService;
  let mockVideoListService: VideoListService;
  let mockRouter: Router;
  let mockDialog: MatDialog;

  beforeEach(() => {
    vi.resetAllMocks();

    mockVideoListingService = {
      getVideos: vi.fn().mockResolvedValue({}),
    };

    mockCognitoService = {
      getAccountType: vi.fn().mockResolvedValue({}),
    };

    vi.spyOn(console, 'log');
    component = new VideoListComponent(mockVideoListingService as any, mockCognitoService as any, mockVideoListService, mockRouter, mockDialog);
  });

  describe('loadVideos function', () => {
    it('should successfully call the loadVideos function', () => {
      component.loadVideos();
      expect(console.log).toHaveBeenCalledWith('Success');
    });
  });

  describe('loadAccountType function', () => {
    it('should successfully call the loadAccountType function', () => {
      component.loadAccountType();
      expect(console.log).toHaveBeenCalledWith('Success');
    });
  });

  describe('fetchContactList function', () => {
    it('should successfully call the fetchContactList function', () => {
      component.fetchContactList();
      expect(console.log).toHaveBeenCalledWith('Success');
    });
  });

  describe('VideoListComponent created', () => {
    it('should check to see if VideoListComponent has been successfully created', () => {
      expect(component);
    });
    
  });
});
