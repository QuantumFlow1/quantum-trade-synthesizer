
export type UserRole = 'trader' | 'admin' | 'super_admin' | 'viewer' | 'analyst' | 'lov_trader';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  status: UserStatus;
  last_login?: Date;
  created_at?: Date;
  subscription_tier?: SubscriptionTier;
  api_access?: boolean;
  trading_enabled?: boolean;
}
