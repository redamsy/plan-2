import { Image } from "./Image";

export interface Product {
  id: string;
  itemCode: string;
  title: string;
  description: string;
  image: Image;
  price: number;
  originalPrice?: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}
export interface IProductBody {
  id?: string;
  itemCode: string;
  title: string;
  description: string;
  imageId: string;
  price: number;
  originalPrice?: number;
  remaining: number;
}