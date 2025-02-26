
import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { UserProfile } from '@/types/auth'
import { supabase } from '@/lib/supabase'

export const useUserProfile = (
  user: User | null,
  setUserProfile: (profile: UserProfile | null) => void
) => {
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
  }, [user, setUserProfile])
}
