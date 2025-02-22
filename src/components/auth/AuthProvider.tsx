
import { createContext, useContext } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { UserProfile, UserRole } from '@/types/auth'
import { useAuthState } from '@/hooks/use-auth-state'
import { useAuthMethods } from '@/hooks/use-auth-methods'
import { useUserProfile } from '@/hooks/use-user-profile'

type AuthContextType = {
  session: Session | null
  user: User | null
  userProfile: UserProfile | null
  isAdmin: boolean
  isTrader: boolean
  signIn: {
    email: (email: string, password: string) => Promise<void>
    google: () => Promise<void>
    github: () => Promise<void>
  }
  signOut: () => Promise<void>
  checkPermission: (requiredRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, user, isLoading, isSigningOut, setIsSigningOut } = useAuthState()
  const userProfile = useUserProfile(user)
  const { signIn, signOut } = useAuthMethods(isSigningOut, setIsSigningOut)

  const isAdmin = userProfile?.role === 'admin'
  const isTrader = userProfile?.role === 'trader'

  const checkPermission = (requiredRole: UserRole): boolean => {
    if (!userProfile) return false
    if (userProfile.role === 'admin') return true
    return userProfile.role === requiredRole
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userProfile,
      isAdmin,
      isTrader,
      signIn, 
      signOut,
      checkPermission 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth moet binnen een AuthProvider gebruikt worden')
  }
  return context
}

