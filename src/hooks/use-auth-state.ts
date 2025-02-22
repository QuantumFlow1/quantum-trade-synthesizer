
import { useState, useCallback, useEffect } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'
import { clearLocalStorageAuth } from '@/lib/auth-utils'

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { toast } = useToast()

  const clearAuthState = useCallback(() => {
    console.log('Clearing auth state')
    setUser(null)
    setSession(null)
    clearLocalStorageAuth()
  }, [])

  const handleAuthStateChange = useCallback(async (_event: string, session: Session | null) => {
    console.log("Auth state changed:", _event, session?.user?.id)
    
    if (_event === 'SIGNED_OUT') {
      clearAuthState()
      toast({
        title: "Succesvol uitgelogd",
        description: "U bent succesvol uitgelogd.",
      })
    } else if (session) {
      setSession(session)
      setUser(session.user)
    }
  }, [clearAuthState, toast])

  useEffect(() => {
    console.log('Setting up auth state')
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    return () => {
      console.log('Cleaning up auth state subscription')
      subscription.unsubscribe()
    }
  }, [handleAuthStateChange])

  return {
    session,
    user,
    isLoading,
    isSigningOut,
    setIsSigningOut
  }
}
