import { AxiosResponse } from "axios";
import otherAxios from "../interceptors/otherAxios";
import { ICategoryBody, Category } from "../models/Category";

export const getCategories = async (): Promise<AxiosResponse<Category[]>> => {
  const resp = await otherAxios.get<Category[]>("/api/cats/categories");

  return resp;
};

export const createCategory = async (
  category: ICategoryBody
): Promise<AxiosResponse<Category>> => {
  const resp = await otherAxios.post<Category>("/api/cats/categories", category);
  return resp;
};

export const updateCategory = async (
  category: ICategoryBody
): Promise<AxiosResponse<Category>> => {
  const resp = await otherAxios.put<Category>(`/api/cats/categories/${category.id}`, category);
  return resp;
};

export const deleteCategory = async (
  categoryId: string
): Promise<AxiosResponse<void>> => {
  const resp = await otherAxios.delete(`/api/cats/categories/${categoryId}`);

  return resp;
};
