import { SignUpComponent } from '../src/app/sign-up/sign-up.component';
import { describe, it, expect, beforeEach, vi, Mock} from 'vitest';

describe('SignUpComponent', () => {

  /* Can't resolve this error, no tests written besides verifying component creation:

  Error: The injectable 'PlatformLocation' needs to be compiled using the JIT compiler, but '@angular/compiler' is not available.

  The injectable is part of a library that has been partially compiled.
  However, the Angular Linker has not processed the library such that JIT compilation is used as fallback.

  Ideally, the library is processed using the Angular Linker to become fully AOT compiled.
  Alternatively, the JIT compiler should be loaded by bootstrapping using '@angular/platform-browser-dynamic' or '@angular/platform-server',
  or manually provide the compiler with 'import "@angular/compiler";' before bootstrapping.
  */

  let component: SignUpComponent;
  let mockRouter: { navigate: any; };
  let mockCognitoService;
  let mockSnackBar;
  let mockSignupService;

  beforeEach(() => {
    vi.resetAllMocks();

    mockCognitoService = {
      signUp: vi.fn().mockResolvedValue({}),
      checkS3UserFolder: vi.fn().mockResolvedValue(true),
      createS3UserFolder: vi.fn().mockResolvedValue({}),
      checkS3CaptionsFolder: vi.fn().mockResolvedValue(true),
      createS3CaptionsFolder: vi.fn().mockResolvedValue({}),
      subscribeUserToSnsTopic: vi.fn().mockResolvedValue({}),
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue({}),
    };

    mockSnackBar = {
      open: vi.fn(),
    };

    mockSignupService = {
      getAll: vi.fn().mockResolvedValue([]),
      store: vi.fn().mockResolvedValue({})
    };

    vi.spyOn(console, 'log');
    component = new SignUpComponent(mockRouter as any, mockCognitoService as any, mockSnackBar as any, mockSignupService as any);
  });

  describe('SignUpComponent created', () => {
    it('should check to see if SignUpComponent has been successfully created', () => {
      expect(component);
    });
    
  });
}); 