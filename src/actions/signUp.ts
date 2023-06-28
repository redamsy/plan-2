import { AxiosResponse } from "axios";
import authAxios from "../interceptors/authAxios";
import { ISignUpBody } from "../models/SignUp";
import { UserProfile } from "../models/userProfile";

export const signUpFn = async ({
  name,
  userName,
  password,
}: ISignUpBody): Promise<
  AxiosResponse<{
    userProfile: UserProfile;
  }>
> => {
  const resp = await authAxios.post<{
    userProfile: UserProfile;
  }>("/api/user/signup", {
    name,
    userName,
    password,
    confirmPassword: password,
  });
  console.log("signUpFn: resp", resp);

  return resp;
};
