import { AxiosResponse } from "axios";
import otherAxios from "../interceptors/otherAxios";
import { IColorBody, Color } from "../models/Color";

export const getColors = async (): Promise<AxiosResponse<Color[]>> => {
  const resp = await otherAxios.get<Color[]>("/api/cats/colors");

  return resp;
};

export const createColor = async (
  color: IColorBody
): Promise<AxiosResponse<Color>> => {
  const resp = await otherAxios.post<Color>("/api/cats/colors", color);
  return resp;
};

export const updateColor = async (
  color: IColorBody
): Promise<AxiosResponse<Color>> => {
  const resp = await otherAxios.put<Color>(`/api/cats/colors/${color.id}`, color);
  return resp;
};

export const deleteColor = async (
  colorId: string
): Promise<AxiosResponse<void>> => {
  const resp = await otherAxios.delete(`/api/cats/colors/${colorId}`);

  return resp;
};
