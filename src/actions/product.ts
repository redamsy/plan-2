import { AxiosResponse } from "axios";
import otherAxios from "../interceptors/otherAxios";
import { IProductBody, Product } from "../models/Product";

export const getProducts = async (): Promise<AxiosResponse<Product[]>> => {
  const resp = await otherAxios.get<Product[]>("/api/products");

  return resp;
};

export const createProduct = async (
  product: IProductBody
): Promise<AxiosResponse<Product>> => {
  const resp = await otherAxios.post<Product>("/api/products", product);
  return resp;
};

export const updateProduct = async (
  product: IProductBody
): Promise<AxiosResponse<Product>> => {
  const resp = await otherAxios.put<Product>(`/api/products/${product.id}`, product);
  return resp;
};

export const deleteProduct = async (
  productId: string
): Promise<AxiosResponse<void>> => {
  const resp = await otherAxios.delete(`/api/products/${productId}`);

  return resp;
};
