
export interface TransactionAudit {
  id: string;
  user_id: string;
  transaction_type: string;
  asset_symbol: string;
  amount: number;
  price: number;
  value: number;
  high_value: boolean;
  required_2fa: boolean;
  source_ip: string;
  user_agent: string;
  status: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}
