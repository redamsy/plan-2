import { AxiosResponse } from "axios";
import otherAxios from "../interceptors/otherAxios";
import { UserProfile, ICurrency } from "../models/userProfile";
import { IChangePasswordBody } from "../models/ChangePassword";

export const getCurrentUserProfile = async (): Promise<
  AxiosResponse<UserProfile>
> => {
  const resp = await otherAxios.get<UserProfile>("/api/user/self");
  console.log("getCurrentUserProfile: resp", resp);

  return resp;
};

export const updateRate = async (
  currency: ICurrency
): Promise<AxiosResponse<UserProfile>> => {
  const resp = await otherAxios.put<UserProfile>(`api/user/currency`, currency);
  return resp;
};

export const changePasswordFn = async ({
  password,
  newPassword,
}: IChangePasswordBody): Promise<
  AxiosResponse<{
    userProfile: UserProfile;
  }>
> => {
  const resp = await otherAxios.put<{
    userProfile: UserProfile;
  }>("/api/user/update-password", {
    password,
    newPassword,
    confirmNewPassword: newPassword,
  });
  console.log("changePasswordFn: resp", resp);

  return resp;
};
