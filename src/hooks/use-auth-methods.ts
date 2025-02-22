
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'

export const useAuthMethods = (isSigningOut: boolean, setIsSigningOut: (value: boolean) => void) => {
  const { toast } = useToast()

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
    if (isSigningOut) return
    
    setIsSigningOut(true)
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
    } catch (error) {
      console.error('Uitlog error:', error)
      toast({
        title: "Uitlog fout",
        description: "Er is een fout opgetreden tijdens het uitloggen.",
        variant: "destructive"
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return { signIn, signOut }
}

