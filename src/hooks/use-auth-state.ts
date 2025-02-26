
import { useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { UserProfile } from '@/types/auth'

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  return {
    session,
    setSession,
    user,
    setUser,
    userProfile,
    setUserProfile,
    isLoading,
    setIsLoading
  }
}
