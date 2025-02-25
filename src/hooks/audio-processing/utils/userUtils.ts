
import { UserProfile } from '@/types/auth'

/**
 * Determine user level based on profile
 */
export const getUserLevel = (userProfile: UserProfile | null): string => {
  // Determine user level based on userProfile or default to beginner
  if (userProfile?.role === 'trader' || userProfile?.role === 'admin') {
    return 'advanced'
  }
  return 'beginner'
}
