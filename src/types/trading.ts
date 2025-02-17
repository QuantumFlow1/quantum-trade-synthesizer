
export type TradeType = 'buy' | 'sell' | 'short' | 'long'
export type TradeStatus = 'pending' | 'executed' | 'cancelled' | 'failed'

export interface TradingPair {
  id: string
  symbol: string
  base_asset: string
  quote_asset: string
  min_trade_amount: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Trade {
  id: string
  user_id: string
  pair_id: string
  type: TradeType
  amount: number
  price: number
  status: TradeStatus
  ai_confidence?: number
  ai_analysis?: {
    sentiment?: string
    recommendation?: string
    risk_level?: string
    analysis_details?: string
  }
  executed_at?: string
  created_at: string
  updated_at: string
}
