import React, { useCallback, useEffect, useMemo, useState } from "react";
import { signInFn } from "../actions/signIn";
import { signUpFn } from "../actions/signUp";
import { getCurrentUserProfile, updateRate } from "../actions/user";
import CircularProgressPage from "../components/CircularProgressPage";
import { AuthContext, initialContext } from "../context/authContext";
import { ISignInBody } from "../models/SignIn";
import { ISignUpBody } from "../models/SignUp";
import { UserProfile, ICurrency } from "../models/userProfile";
import { IChangePasswordBody } from "../models/ChangePassword";
import { changePasswordFn } from "../actions/user";

interface IAuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialContext.state.isAuthenticated
  );
  const [userProfile, setUserProfile] = useState<
    UserProfile | null | undefined
  >(initialContext.state.userProfile);
  const [initialLoading, setInitialLoading] = useState<boolean>(
    initialContext.state.initialLoading
  );
  const [isSigningIn, setIsSigningIn] = useState<boolean>(
    initialContext.state.isSigningIn
  );
  const [signInError, setSignInError] = useState<string>(
    initialContext.state.signInError
  );
  const [isSigningUp, setIsSigningUp] = useState<boolean>(
    initialContext.state.isSigningUp
  );
  const [signUpError, setSignUpError] = useState<string>(
    initialContext.state.signUpError
  );
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(
    initialContext.state.isChangingPassword
  );
  const [changePasswordError, setChangePasswordError] = useState<string>(
    initialContext.state.changePasswordError
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(
    initialContext.state.isUpdating
  );
  const [updateError, setUpdateError] = useState<string>(
    initialContext.state.updateError
  );
  const [openSnack, setOpenSnack] = useState<boolean>(
    initialContext.state.openSnack
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("access_token");
        if (userId && token) {
          setInitialLoading(true);
          const currentUserProfileResponse = await getCurrentUserProfile();
          const userProfile = currentUserProfileResponse.data;

          console.log("authProvider: currentUserProfileResponse", currentUserProfileResponse);

          if (userProfile) {
            setUserProfile(userProfile);
            setIsAuthenticated(true);
            setInitialLoading(false);
          } else {
            setInitialLoading(false);
            setUserProfile(null);
            setIsAuthenticated(false);
          }
        } else {
          setInitialLoading(false);
        }
      } catch (error: Error | any) {
        setInitialLoading(false);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    };

    fetchUserData();
  }, []);

  const clearErrorsAndCloseSnack = useCallback(() => {
    setUpdateError("");
    setChangePasswordError("");
    setOpenSnack(false);
  }, [])

  // used the useCallback hook to prevent the function from being recreated after a re-render
  const signUp = useCallback(async ({ name, userName, password }: ISignUpBody) => {
    try {
      setIsSigningUp(true);
      const signUpResponse = await signUpFn({ name, userName, password });
      if (signUpResponse.status === 201) {
        console.log("authProvider: signUpResponse", signUpResponse);

        // complete a successful signUp process
        setIsSigningUp(false);
        setSignUpError("");
        // go to the sign in page
        // window.location.href = "/signin";
      } else {
        setIsSigningUp(false);
        setSignUpError(`SignUp failed. ${signUpResponse.status}`);
      }
    } catch (error: Error | any) {
      console.log("authProvider: error", error);
      setIsSigningUp(false);
      if (error.response && error.response.data && error.response.data.message) {
        setSignUpError(
          `SignUp failed. ${error.response.data.message}`
        );        
      } else {
        setSignUpError(
          `SignUp failed. ${error.message}`
        );        
      }
    }
  }, []);

  // used the useCallback hook to prevent the function from being recreated after a re-render
  const signIn = useCallback(async ({ userName, password }: ISignInBody) => {
    try {
      setIsSigningIn(true);
      const signInResponse = await signInFn({ userName, password });
      if (signInResponse.data && signInResponse.status === 201) {
        console.log("authProvider: signInResponse", signInResponse);

        const { userProfile, token } = signInResponse.data;
        // store the token in localStorage
        localStorage.setItem("access_token", token);

        // store the userProfile's id in localStorage
        localStorage.setItem("userId", userProfile.userId);

        // complete a successful signIn process
        setUserProfile(userProfile);
        setIsAuthenticated(true);
        setIsSigningIn(false);
        setSignInError("");
        // go to the home page
        window.location.href = "/";
      } else {
        setUserProfile(null);
        setIsAuthenticated(false);
        setIsSigningIn(false);
        setSignInError(`SignIn failed. ${signInResponse.status}`);
      }
    } catch (error: Error | any) {
      setUserProfile(null);
      setIsAuthenticated(false);
      setIsSigningIn(false);
      if (error.response && error.response.data && error.response.data.message) {
        setSignInError(
          `SignIn failed. ${error.response.data.message}`
        );        
      } else {
        setSignInError(
          `SignIn failed. ${error.message}`
        );        
      }
    }
  }, []);

  const changePassword = useCallback(async ({ password, newPassword }: IChangePasswordBody) => {
    try {
      setIsChangingPassword(true);
      const changePasswordResponse = await changePasswordFn({ password, newPassword });
      if (changePasswordResponse.status === 200) {
        console.log("authProvider: changePasswordResponse", changePasswordResponse);

        // complete a successful ChangePassword process
        setIsChangingPassword(false);
        setChangePasswordError("");
        setOpenSnack(true);
      } else {
        setIsChangingPassword(false);
        setChangePasswordError(`ChangePassword failed. ${changePasswordResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      console.log("authProvider: error", error);
      setIsChangingPassword(false);
      if (error.response && error.response.data && error.response.data.message) {
        setChangePasswordError(
          `ChangePassword failed. ${error.response.data.message}`
        );        
      } else {
        setChangePasswordError(
          `ChangePassword failed. ${error.message}`
        );        
      }
      setOpenSnack(true);
    }
  }, []);

  const updateCurrentRate = useCallback(async (currencyBody: ICurrency) => {
    try {
      setIsUpdating(true);
      const updateResponse = await updateRate(currencyBody);
      console.log("authProvider: updateCurrentRate", updateResponse);
      const { status, data: updatedUser } = updateResponse;
      if (updatedUser && status === 200) {


        if (userProfile) setUserProfile({
          ...userProfile,
          rate: updatedUser.rate,
          currency: updatedUser.currency
        })

        setIsUpdating(false);
        setUpdateError("");
        setOpenSnack(true);

      } else {
        setIsUpdating(false);
        setUpdateError(`Update rate faild: ${updateResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsUpdating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setUpdateError(`Update rate faild: ${error.response.data.message}`);
      } else {
        setUpdateError(`Update rate faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [userProfile]);

  // used the useCallback hook to prevent the function from being recreated after a re-render
  const signOut = useCallback(() => {
    //TODO: better set Token in database to revoked(anyways token has expry time)
    setUserProfile(null);
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
  }, []);

  // stored the auth context value in useMemo hook to recalculate
  // the value only when necessary
  const authContext = useMemo(
    () => ({
      state: {
        isAuthenticated,
        userProfile,
        initialLoading,
        isSigningIn,
        signInError,
        isSigningUp,
        signUpError,
        isChangingPassword,
        changePasswordError,
        isUpdating,
        updateError,
        openSnack,
      },
      actions: { signIn, signUp, signOut, changePassword, updateCurrentRate, clearErrorsAndCloseSnack },
    }),
    [
      signIn,
      signUp,
      signOut,
      changePassword,
      updateCurrentRate,
      clearErrorsAndCloseSnack,
      isAuthenticated,
      userProfile,
      initialLoading,
      isSigningIn,
      signInError,
      isSigningUp,
      signUpError,
      isChangingPassword,
      changePasswordError,
      isUpdating,
      updateError,
      openSnack
    ]
  );

  return (
    <AuthContext.Provider value={authContext}>
      {initialLoading ? <CircularProgressPage /> : children}
    </AuthContext.Provider>
  );
};
