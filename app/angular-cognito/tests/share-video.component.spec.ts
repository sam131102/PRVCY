import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareVideoComponent } from '../src/app/share-video/share-video.component';
import { describe, it, expect, beforeEach, vi} from 'vitest';
import { VideoListingService } from 'src/app/video-listing.service';
import { CognitoService } from 'src/app/cognito.service';
import { Router } from '@angular/router';
import { VideoListService } from 'src/app/video-list/videolist.service';
import { MatDialog } from '@angular/material/dialog';

describe('ShareVideoComponent', () => {
  let component: ShareVideoComponent;
  let fixture: ComponentFixture<ShareVideoComponent>;
  let mockVideoListingService: VideoListingService;
  let mockCognitoService: CognitoService;
  let mockRouter: Router;
  let mockVideoListService: VideoListService;
  let mockDialog: MatDialog;

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(console, 'log');
    component = new ShareVideoComponent(mockVideoListingService, mockCognitoService, mockRouter,mockVideoListService,mockDialog);
  });

  describe('fetchContactList function', () => {
    it('should call the fetch contact list function with success', () => {
      component.fetchContactList();
      expect(console.log).toHaveBeenCalledWith('Success');
    });
  });

  describe('ShareVideoComponent created', () => {
    it('should check to see if ShareVideoComponent has been successfully created', () => {
      expect(component);
    });
  });

});
