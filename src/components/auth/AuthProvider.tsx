
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import { UserProfile, UserRole } from '@/types/auth'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()

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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session)
      setSession(session)
      setUser(session?.user ?? null)

      // Als de gebruiker uitlogt, wis dan het profiel
      if (_event === 'SIGNED_OUT') {
        setUserProfile(null)
      }
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

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
          toast({
            title: "Fout bij ophalen profiel",
            description: "Er is een fout opgetreden bij het ophalen van uw profiel.",
            variant: "destructive"
          })
          return
        }

        if (data) {
          setUserProfile(data as UserProfile)
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error)
      }
    }

    fetchUserProfile()
  }, [user, toast])

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
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Uitlog error:', error)
        toast({
          title: "Uitlog fout",
          description: "Er is een fout opgetreden tijdens het uitloggen.",
          variant: "destructive"
        })
        return
      }
      
      // Reset state na succesvolle uitlog
      setUser(null)
      setSession(null)
      setUserProfile(null)
      
      // Verwijder alle Supabase gerelateerde items uit localStorage
      const items = { ...localStorage }
      Object.keys(items).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key)
        }
      })

      // Toon succes bericht
      toast({
        title: "Succesvol uitgelogd",
        description: "U bent succesvol uitgelogd.",
      })
    } catch (error) {
      console.error('Uitlog error:', error)
      toast({
        title: "Uitlog fout",
        description: "Er is een fout opgetreden tijdens het uitloggen.",
        variant: "destructive"
      })
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
