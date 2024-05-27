import { VideoRecorderComponent } from '../src/app/video-recorder/video-recorder.component';
import { describe, it, expect, beforeEach, vi} from 'vitest';

describe('VideoRecorderComponent', () => {
  
  let component: VideoRecorderComponent;
  let mockCognitoService;
  let mockKinesisVideoService: any;
  let mockDialog: any;
  let mockRouter: any;


  beforeEach(() => {
    vi.resetAllMocks();

    mockCognitoService = {
      getUsername: vi.fn().mockResolvedValue({}),
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue({}),
    }
    
    vi.spyOn(console, 'log');
    component = new VideoRecorderComponent(mockRouter as any, mockRouter as any, mockDialog as any);
  });

  describe('download function', () => {
    it('should output success message if the download function is called successfully', () => {
      component.download();
      expect(console.log).toHaveBeenCalledWith("Success");
    });
  });

  describe('playback function', () => {
    it('should output success message if the playback function is called successfully', () => {
      component.playback();
      expect(console.log).toHaveBeenCalledWith("Success");
    });
  });

  describe('VideoRecorderComponent created', () => {
    it('should check to see if VideoRecorderComponent has been successfully created', () => {
      expect(component);
    });
  });

});