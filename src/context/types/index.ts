import { ISignInBody } from "../../models/SignIn";
import { ISignUpBody } from "../../models/SignUp";
import { IChangePasswordBody } from "../../models/ChangePassword";
import { UserProfile, ICurrency } from "../../models/userProfile";

export interface IAuthState {
  isAuthenticated: boolean;
  userProfile: UserProfile | null | undefined;
  initialLoading: boolean;
  isSigningIn: boolean;
  signInError: string;
  isSigningUp: boolean;
  signUpError: string;
  changePasswordError: string;
  isChangingPassword: boolean;
  isUpdating: boolean;
  updateError: string;
  openSnack: boolean;
}

export interface IAuthAction {
  signIn: ({ userName, password }: ISignInBody) => Promise<void>;
  signUp: ({ name, userName, password }: ISignUpBody) => Promise<void>;
  signOut: () => void;
  changePassword: ({ password, newPassword }: IChangePasswordBody) => Promise<void>;
  updateCurrentRate: (rateBody: ICurrency) => Promise<void>;
  clearErrorsAndCloseSnack: () => void;
}

export interface IAuthContext {
  state: IAuthState;
  actions: IAuthAction;
}
