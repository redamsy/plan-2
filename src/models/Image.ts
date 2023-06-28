export interface Image {
  id: string;
  name: string;
  url: string;
  isDeletable: boolean;
}

export interface IImageBody {
  id?: string;
  name: string;
  url: string;
}
