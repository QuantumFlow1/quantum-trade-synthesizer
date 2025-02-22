
import { UserProfile } from '@/types/auth'

export const clearLocalStorageAuth = () => {
  const items = { ...localStorage }
  Object.keys(items).forEach(key => {
    if (key.startsWith('sb-')) {
      localStorage.removeItem(key)
    }
  })
}

