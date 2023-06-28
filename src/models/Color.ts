export interface Color {
  id: string;
  name: string;
  colorCode: string;
  isDeletable: boolean;
}

export interface IColorBody {
  id?: string;
  name: string;
  colorCode: string;
}
  