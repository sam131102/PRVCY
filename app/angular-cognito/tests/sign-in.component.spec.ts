import { SignInComponent } from '../src/app/sign-in/sign-in.component';
import { describe, it, expect, beforeEach, vi} from 'vitest';

describe('Signin Component', () => {

  let component: SignInComponent;
  let mockRouter;
  let mockCognitoService: { signIn: any; };

  beforeEach(() => {
    vi.resetAllMocks();

    mockRouter = {
      navigate: vi.fn().mockResolvedValue({}),
    };

    mockCognitoService = {
      signIn: vi.fn().mockResolvedValue({}),
    };

    component = new SignInComponent(mockRouter as any, mockCognitoService as any);
  });

  describe('Signin: No data', () => {
    it('should display an error message when logging in without any information', async () => {
      //Calling empty signin
      component.signIn();

      //Expecting email and password if signin inputs are empty
      expect(component.errorMessage).toEqual('Email and password are required');
    });
  });
  
  describe('Signin: Incorrect email and password', () => {
    it('should display an incorrect email or password error', async () => {
      //Error email and password set
      component.user.email = 'errorr@email.com';
      component.user.password = 'error';

      //Mocking the rejected email and password signin
      mockCognitoService.signIn.mockRejectedValue(new Error('SignIn failed'));
      component.signIn();

      //Checking to see if error message & loading matches
      expect(component.errorMessage).toEqual('Incorrect email or password');
      });
  });

  describe('Signin: Correct email and password', () => {
    it('should successfully log the user in', async () => {
      //Valid email and password set
      component.user.email = 'segundooo';
      component.user.password = 'segundooo123W#';

      //Mocking the successful email and password signin
      mockCognitoService.signIn.mockResolvedValue(true);
      component.signIn();

      //Checking to see if error message & success message matches
      expect(component.successMessage).toEqual('Success');
    });
  });

  describe('SignInComponent created', () => {
    it('should check to see if SignInComponent has been successfully created', () => {
      expect(component);
    });
    
  });

}); 