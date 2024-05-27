import { DashboardComponent } from '../src/app/dashboard/dashboard.component';
import { describe, it, expect, beforeEach, vi} from 'vitest';

describe('DashboardComponent', () => {

  let component: DashboardComponent;
  let mockRouter;
  let mockCognitoService;
  let mockMatDialog: any;

  beforeEach(() => {
    vi.resetAllMocks();

    mockRouter = {
    };

    mockCognitoService = {
      getUser: vi.fn().mockResolvedValue({}),
      updateUserAttribute: vi.fn().mockResolvedValue({})
    };

    vi.spyOn(console, 'log');
    component = new DashboardComponent(mockRouter as any, mockCognitoService as any, mockMatDialog as any);
  });

  describe('joinOrg Function', () => {
    it('should output success message if joinOrg function is called successfully', () => {
      component.joinOrg("test");
      expect(console.log).toHaveBeenCalledWith("joinOrg Success")
    });
  });

  describe('DashboardComponent created', () => {
    it('should check to see if DashboardComponent has been successfully created', () => {
      expect(component);
    });
    
  });

});
