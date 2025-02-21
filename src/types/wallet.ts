
export type WalletType = "spot" | "margin" | "futures";
export type WalletStatus = "active" | "suspended" | "closed";

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  available_balance: number;
  locked_balance: number;
  status: WalletStatus;
}
