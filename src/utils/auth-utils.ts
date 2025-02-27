
import { UserProfile, UserRole } from '@/types/auth'

export const checkPermission = (userProfile: UserProfile | null, requiredRole: UserRole | UserRole[]): boolean => {
  if (!userProfile) return false
  
  // Super admin can do everything
  if (userProfile.role === 'super_admin') return true
  
  // Check if user has any of the required roles
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userProfile.role)
  }
  
  // For normal admins, check if they're not trying to access super_admin stuff
  if (userProfile.role === 'admin') {
    return requiredRole !== 'super_admin'
  }
  
  // For lov_trader, check if they can access trader stuff
  if (userProfile.role === 'lov_trader') {
    return requiredRole === 'trader' || requiredRole === 'lov_trader' || requiredRole === 'viewer'
  }
  
  // Direct role check
  return userProfile.role === requiredRole
}

export const getUserRoleInfo = (userProfile: UserProfile | null) => {
  if (!userProfile) return { isAdmin: false, isTrader: false, isLovTrader: false }
  
  const isAdmin = userProfile.role === 'admin' || userProfile.role === 'super_admin'
  const isTrader = userProfile.role === 'trader' || userProfile.role === 'lov_trader'
  const isLovTrader = userProfile.role === 'lov_trader'
  
  return { isAdmin, isTrader, isLovTrader }
}

// New function to check if a user should have API key access
export const hasApiKeyAccess = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false
  
  // Super admin, admin, and lov_trader roles have API key access
  return userProfile.role === 'super_admin' || 
         userProfile.role === 'admin' || 
         userProfile.role === 'lov_trader' || 
         (userProfile.role === 'trader' && !!userProfile.api_access)
}
