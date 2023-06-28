export interface UserProfile {
  userId: string;
  userName: string;
  name: string;
  rate: number;
  currency: CURRENCY_ENUM;
}
export enum CURRENCY_ENUM {
  LBP = 'LBP',
  USD = '$',
}

export type ICurrency = Pick<UserProfile, 'rate' | 'currency' >;