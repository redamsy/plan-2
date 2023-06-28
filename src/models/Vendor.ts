export interface Vendor {
  id: string;
  name: string;
  isDeletable: boolean;
}

export interface IVendorBody {
  id?: string;
  name: string;
}
