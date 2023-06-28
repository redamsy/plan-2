import { AxiosResponse } from "axios";
import otherAxios from "../interceptors/otherAxios";
import { IImageBody, Image } from "../models/Image";

export const getImages = async (): Promise<AxiosResponse<Image[]>> => {
  const resp = await otherAxios.get<Image[]>("/api/cats/images");

  return resp;
};

export const createImage = async (
  image: IImageBody
): Promise<AxiosResponse<Image>> => {
  const resp = await otherAxios.post<Image>("/api/cats/images", image);
  return resp;
};

export const updateImage = async (
  image: IImageBody
): Promise<AxiosResponse<Image>> => {
  const resp = await otherAxios.put<Image>(`/api/cats/images/${image.id}`, image);
  return resp;
};

export const deleteImage = async (
  imageId: string
): Promise<AxiosResponse<void>> => {
  const resp = await otherAxios.delete(`/api/cats/images/${imageId}`);

  return resp;
};
