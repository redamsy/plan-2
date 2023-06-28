import { AxiosResponse } from "axios";
import otherAxios from "../interceptors/otherAxios";
import { IPageBody, Page } from "../models/Page";

export const getPages = async (): Promise<AxiosResponse<Page[]>> => {
  const resp = await otherAxios.get<Page[]>("/api/user/pages");

  return resp;
};

export const createPage = async (
  page: IPageBody
): Promise<AxiosResponse<Page>> => {
  const resp = await otherAxios.post<Page>("/api/user/pages", page);
  return resp;
};

export const updatePage = async (
  page: IPageBody
): Promise<AxiosResponse<Page>> => {
  const resp = await otherAxios.put<Page>(`/api/user/pages/${page.id}`, page);
  return resp;
};

export const deletePage = async (
  pageId: string
): Promise<AxiosResponse<void>> => {
  const resp = await otherAxios.delete(`/api/user/pages/${pageId}`);

  return resp;
};
