
import { useAuth } from '@/components/auth/AuthProvider'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { SuperAdminVoiceContainer } from './voice-assistant/SuperAdminVoiceContainer'

export const SuperAdminVoiceAssistant = () => {
  const { userProfile } = useAuth()
  
  // If not super admin, don't render anything
  if (userProfile?.role !== 'super_admin') {
    return null
  }

  // Find the EdriziAI Admin voice template
  const edriziAdminVoice = VOICE_TEMPLATES.find(v => v.id === 'EdriziAI-admin')
  if (!edriziAdminVoice) {
    console.error('EdriziAI Admin voice template not found')
    // Fallback to standard EdriziAI if admin voice is not found
    const fallbackVoice = VOICE_TEMPLATES.find(v => v.id === 'EdriziAI-info')
    if (!fallbackVoice) {
      console.error('No suitable voice template found')
      return null
    }
    return <SuperAdminVoiceContainer edriziVoice={fallbackVoice} />
  }

  return <SuperAdminVoiceContainer edriziVoice={edriziAdminVoice} />
}
