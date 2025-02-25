
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import { UserProfile, UserRole } from '@/types/auth'

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
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get the current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session)
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null)
        return
      }

      console.log("Fetching profile for user:", user.id)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return
      }

      if (data) {
        console.log("User profile retrieved:", data)
        setUserProfile(data as UserProfile)
      }
    }

    fetchUserProfile()
  }, [user])

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin'
  const isTrader = userProfile?.role === 'trader' || userProfile?.role === 'lov_trader'
  const isLovTrader = userProfile?.role === 'lov_trader'

  const checkPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!userProfile) return false
    
    // Super admin can do everything
    if (userProfile.role === 'super_admin') return true
    
    // Check if user has any of the required roles
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userProfile.role);
    }
    
    // For normal admins, check if they're not trying to access super_admin stuff
    if (userProfile.role === 'admin') {
      return requiredRole !== 'super_admin';
    }
    
    // For lov_trader, check if they can access trader stuff
    if (userProfile.role === 'lov_trader') {
      return requiredRole === 'trader' || requiredRole === 'lov_trader' || requiredRole === 'viewer';
    }
    
    // Direct role check
    return userProfile.role === requiredRole;
  }

  const signIn = {
    email: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    },
    google: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false
        }
      })
      if (error) throw error
    },
    github: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    },
  }

  const signOut = async () => {
    try {
      console.log("Signing out...")
      await supabase.auth.signOut()
      
      // Reset state after successful signout
      setUser(null)
      setSession(null)
      setUserProfile(null)
      
      // Remove any Supabase related items from localStorage
      const items = { ...localStorage }
      Object.keys(items).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key)
        }
      })
      console.log("Sign out complete")
    } catch (error) {
      console.error('Sign out error:', error)
      // Reset state anyway on error for a clean slate
      setUser(null)
      setSession(null)
      setUserProfile(null)
    }
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
      checkPermission 
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
