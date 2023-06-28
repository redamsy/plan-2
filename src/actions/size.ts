import { AxiosResponse } from "axios";
import otherAxios from "../interceptors/otherAxios";
import { ISizeBody, Size } from "../models/Size";

export const getSizes = async (): Promise<AxiosResponse<Size[]>> => {
  const resp = await otherAxios.get<Size[]>("/api/cats/sizes");

  return resp;
};

export const createSize = async (
  size: ISizeBody
): Promise<AxiosResponse<Size>> => {
  const resp = await otherAxios.post<Size>("/api/cats/sizes", size);
  return resp;
};

export const updateSize = async (
  size: ISizeBody
): Promise<AxiosResponse<Size>> => {
  const resp = await otherAxios.put<Size>(`/api/cats/sizes/${size.id}`, size);
  return resp;
};

export const deleteSize = async (
  sizeId: string
): Promise<AxiosResponse<void>> => {
  const resp = await otherAxios.delete(`/api/cats/sizes/${sizeId}`);

  return resp;
};
