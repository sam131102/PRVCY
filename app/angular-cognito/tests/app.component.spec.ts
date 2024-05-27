import { AppComponent } from '../src/app/app.component';
import { describe, it, expect, beforeEach, vi} from 'vitest';

describe('AppComponent has been created', () => {
  let component: AppComponent;
  let mockCognitoService;
  let mockRouter;

  beforeEach(() => {
    vi.resetAllMocks();

    mockCognitoService = {
      getUser: vi.fn().mockResolvedValue({}),
      isAuthenticated: vi.fn().mockResolvedValue({}),
      signOut: vi.fn().mockResolvedValue({})
    };

    mockRouter = {};
    
    vi.spyOn(console, 'log');
    component = new AppComponent(mockCognitoService as any, mockRouter as any);
  });

  describe('signOut Function', () => {
    it('should output a success message if the signOut function is called with success', async () => {
      component.signOut();
      expect(console.log).toHaveBeenCalledWith("Successfully signed out!");
    });
  });

  describe('AppComponent created', () => {
    it('should check to see if AppComponent has been successfully created', () => {
      expect(component);
    });
  });

});
