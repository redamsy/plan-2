import { Image } from "./Image";

export interface Category {
  id: string;
  name: string;
  image?: Image; // maybe undefined bcz it not included in getAllProducts aggregate function in the api
  isDeletable: boolean;
}

export interface ICategoryBody {
  id?: string;
  name: string;
  imageId?: string;
}
