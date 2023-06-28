import { AxiosResponse } from "axios";
import otherAxios from "../interceptors/otherAxios";
import { IVendorBody, Vendor } from "../models/Vendor";

export const getVendors = async (): Promise<AxiosResponse<Vendor[]>> => {
  const resp = await otherAxios.get<Vendor[]>("/api/cats/vendors");

  return resp;
};

export const createVendor = async (
  vendor: IVendorBody
): Promise<AxiosResponse<Vendor>> => {
  const resp = await otherAxios.post<Vendor>("/api/cats/vendors", vendor);
  return resp;
};

export const updateVendor = async (
  vendor: IVendorBody
): Promise<AxiosResponse<Vendor>> => {
  const resp = await otherAxios.put<Vendor>(`/api/cats/vendors/${vendor.id}`, vendor);
  return resp;
};

export const deleteVendor = async (
  vendorId: string
): Promise<AxiosResponse<void>> => {
  const resp = await otherAxios.delete(`/api/cats/vendors/${vendorId}`);

  return resp;
};
