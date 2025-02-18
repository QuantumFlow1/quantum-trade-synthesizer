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
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Haal de huidige sessie op bij het laden
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Luister naar auth status veranderingen
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        setUserProfile(data as UserProfile)
      }
    }

    fetchUserProfile()
  }, [user])

  const isAdmin = userProfile?.role === 'admin'
  const isTrader = userProfile?.role === 'trader'

  const checkPermission = (requiredRole: UserRole): boolean => {
    if (!userProfile) return false
    if (userProfile.role === 'admin') return true
    return userProfile.role === requiredRole
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
          redirectTo: window.location.origin
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
      // Reset state first
      setSession(null)
      setUser(null)
      setUserProfile(null)

      // Clear Supabase items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key)
        }
      })

      // Simple signout without scope
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Signout error:', error)
    } finally {
      // Redirect to home and force reload
      window.location.replace('/')
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
