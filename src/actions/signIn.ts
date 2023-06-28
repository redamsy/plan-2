import { AxiosResponse } from "axios";
import authAxios from "../interceptors/authAxios";
import { ISignInBody } from "../models/SignIn";
import { UserProfile } from "../models/userProfile";

export const signInFn = async ({
  userName,
  password,
}: ISignInBody): Promise<
  AxiosResponse<{
    userProfile: UserProfile;
    token: string;
  }>
> => {
  const resp = await authAxios.post<{
    userProfile: UserProfile;
    token: string;
  }>("/api/user/signin", {
    userName,
    password,
  });
  console.log("signInFn: resp", resp);

  return resp;
};
