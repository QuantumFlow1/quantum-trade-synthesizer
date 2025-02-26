
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const useAuthSession = (
  setSession: (session: any) => void,
  setUser: (user: any) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
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
  }, [setSession, setUser, setIsLoading])
}
