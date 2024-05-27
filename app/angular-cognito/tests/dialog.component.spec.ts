import { DialogComponent } from '../src/app/dialog/dialog.component';
import { describe, it, expect, beforeEach, vi} from 'vitest';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let mockRouter: any;
  let mockCognitoService: any;
  let mockMatDialog: any;

  beforeEach(() => {
    vi.resetAllMocks();

    mockCognitoService = {
      updateUserAttribute: vi.fn().mockResolvedValue({}),
    }

    vi.spyOn(console, 'log');
    component = new DialogComponent(mockRouter as any, mockCognitoService as any, mockMatDialog as any);
  });

  describe('joinOrg Function', () => {
    it('should output success message if joinOrg is called successfully', () => {
      component.joinOrg("test");
      expect(console.log).toHaveBeenLastCalledWith("joinOrg Success");
    });
  });

  describe('DialogComponent created', () => {
    it('should check to see if DialogComponent has been successfully created', () => {
      expect(component);
    });
    
  });

});
