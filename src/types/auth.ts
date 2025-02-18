
export type UserRole = 'admin' | 'trader' | 'viewer' | 'super_admin'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  status: 'active' | 'pending' | 'suspended'
  created_at: string
  trading_enabled: boolean
  max_trade_amount?: number
  last_login?: string
}
