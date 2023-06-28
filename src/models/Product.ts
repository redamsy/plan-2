import { Category } from "./Category";
import { SubCategory } from "./SubCategory";
import { Color } from "./Color";
import { Size } from "./Size";
import { Image } from "./Image";
import { Vendor } from "./Vendor";

export interface Product {
  id: string;
  itemCode: string;
  title: string;
  description: string;
  image: Image;
  vendor: Vendor;
  price: number;
  originalPrice?: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}
export interface PSCC {
  id: string;
  category: Category;
  subCategory: SubCategory;
}
export interface Gallery {
  id: string;
  color: Color;
  size: Size;
  image: Image;
  itemSubCode: string;
  subPrice: number;
  subOriginalPrice?: number;
}
export interface DetailedProduct extends Product{
  pSCCs: PSCC[];
  galleries: Gallery[];
}
export interface PSCCIDS {
  categoryId: string;
  subCategoryId: string;
}
export interface GalleryInput {
  colorId: string;
  sizeId: string;
  imageId: string;
  itemSubCode: string;
  subPrice: number;
  subOriginalPrice?: number;
}
export interface IProductBody {
  id?: string;
  itemCode: string;
  title: string;
  description: string;
  imageId: string;
  vendorId: string;
  price: number;
  originalPrice?: number;
  remaining: number;
  pSCCs: PSCCIDS[];
  galleries: GalleryInput[];
}

export interface CategoriesWithSub {
  category: Category,
  subCategories: SubCategory[]
}