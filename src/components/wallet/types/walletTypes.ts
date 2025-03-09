
export type WalletType = 'crypto' | 'fiat';

export interface WalletData {
  address: string;
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  currency: string;
  lastUpdated: Date;
  performanceToday: number;
  performanceWeek: number;
  performanceMonth: number;
  type: WalletType;
}
