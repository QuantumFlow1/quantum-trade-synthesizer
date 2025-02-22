
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { UserProfile } from '@/types/auth'
import { useToast } from './use-toast'

export const useUserProfile = (user: User | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const { toast } = useToast()

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

  return userProfile
}

