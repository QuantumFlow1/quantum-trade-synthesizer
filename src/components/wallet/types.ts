
export interface WalletBalanceData {
  total: number;
  available: number;
  locked: number;
  currency: string;
  lastUpdated: Date;
}

export interface WalletTransactionData {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee';
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  currency: string;
  timestamp: Date;
  hash?: string;
  details: string;
}

export interface WalletAsset {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  allocation: number;
}

export interface CurrencyInfo {
  symbol: string;
  name: string;
  network: string;
  minDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}
