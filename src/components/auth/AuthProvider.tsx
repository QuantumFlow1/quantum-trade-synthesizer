
import { createContext, useContext, useEffect } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { UserProfile, UserRole } from '@/types/auth'
import { useAuthState } from '@/hooks/use-auth-state'
import { useAuthSession } from '@/hooks/use-auth-session'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useAuthActions } from '@/hooks/use-auth-actions'
import { checkPermission, getUserRoleInfo } from '@/utils/auth-utils'
import { useOllamaDockerConnect } from '@/hooks/useOllamaDockerConnect'

type AuthContextType = {
  session: Session | null
  user: User | null
  userProfile: UserProfile | null
  isAdmin: boolean
  isTrader: boolean
  isLovTrader: boolean
  signIn: {
    email: (email: string, password: string) => Promise<void>
    google: () => Promise<void>
    github: () => Promise<void>
  }
  signOut: () => Promise<void>
  checkPermission: (requiredRole: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    session, setSession,
    user, setUser,
    userProfile, setUserProfile,
    isLoading, setIsLoading
  } = useAuthState()
  
  // Setup auth session
  useAuthSession(setSession, setUser, setIsLoading)
  
  // Fetch user profile
  useUserProfile(user, setUserProfile)
  
  // Get Ollama connection functions (for logout handling)
  const { disconnectFromDocker } = useOllamaDockerConnect()
  
  // Auth actions (sign in/out)
  const { signIn, signOut: baseSignOut } = useAuthActions()
  
  // Extended sign out function that also disconnects from Ollama
  const signOut = async () => {
    // Disconnect from Ollama
    disconnectFromDocker()
    
    // Call the original sign out function
    await baseSignOut()
  }
  
  // Role info
  const { isAdmin, isTrader, isLovTrader } = getUserRoleInfo(userProfile)
  
  // Auto-disconnect Ollama when user logs out or session expires
  useEffect(() => {
    if (session === null && user === null) {
      disconnectFromDocker()
    }
  }, [session, user, disconnectFromDocker])
  
  // Permission checker
  const handleCheckPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    return checkPermission(userProfile, requiredRole)
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
      isLovTrader,
      signIn, 
      signOut,
      checkPermission: handleCheckPermission
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
