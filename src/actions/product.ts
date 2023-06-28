import { AxiosResponse } from "axios";
import otherAxios from "../interceptors/otherAxios";
import { IProductBody, DetailedProduct } from "../models/Product";

export const getDetailedProducts = async (): Promise<AxiosResponse<DetailedProduct[]>> => {
  const resp = await otherAxios.get<DetailedProduct[]>("/api/products");

  return resp;
};

export const createProduct = async (
  product: IProductBody
): Promise<AxiosResponse<DetailedProduct>> => {
  const resp = await otherAxios.post<DetailedProduct>("/api/products", product);
  return resp;
};

export const updateProduct = async (
  product: IProductBody
): Promise<AxiosResponse<DetailedProduct>> => {
  const resp = await otherAxios.put<DetailedProduct>(`/api/products/${product.id}`, product);
  return resp;
};

export const deleteProduct = async (
  productId: string
): Promise<AxiosResponse<void>> => {
  const resp = await otherAxios.delete(`/api/products/${productId}`);

  return resp;
};
