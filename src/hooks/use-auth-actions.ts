
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'

export const useAuthActions = () => {
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

  const securityService = {
    send2FACode: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('security-services', {
        body: { 
          action: 'send_2fa_code',
          userId 
        }
      })
      
      if (error) throw error
      return data
    },
    
    verify2FACode: async (userId: string, code: string) => {
      const { data, error } = await supabase.functions.invoke('security-services', {
        body: { 
          action: 'verify_2fa_code',
          userId,
          code 
        }
      })
      
      if (error) throw error
      return data?.verified || false
    },
    
    checkAccountSecurity: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('security-services', {
        body: { 
          action: 'check_account_security',
          userId 
        }
      })
      
      if (error) throw error
      return data
    }
  }

  const signOut = async () => {
    try {
      console.log("Signing out...")
      await supabase.auth.signOut()
      
      // Remove any Supabase related items from localStorage
      const items = { ...localStorage }
      Object.keys(items).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key)
        }
      })
      
      // Show a success toast
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account"
      })
      
      console.log("Sign out complete")
      
      // Force refresh the page to ensure clean state
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
      // Show an error toast
      toast({
        title: "Sign out error",
        description: "An error occurred while signing out",
        variant: "destructive"
      })
    }
  }

  return { signIn, signOut, securityService }
}
