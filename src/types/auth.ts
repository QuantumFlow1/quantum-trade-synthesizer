
export type UserRole = 'admin' | 'trader' | 'analyst'
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise'
export type UserStatus = 'active' | 'suspended' | 'pending'

export interface UserProfile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  role: UserRole
  subscription_tier: SubscriptionTier
  status: UserStatus
  last_login_at: string | null
  created_at: string
  updated_at: string
}
