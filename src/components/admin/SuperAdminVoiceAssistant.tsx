
import { useAuth } from '@/components/auth/AuthProvider'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { SuperAdminVoiceContainer } from './voice-assistant/SuperAdminVoiceContainer'

export const SuperAdminVoiceAssistant = () => {
  const { userProfile } = useAuth()
  
  // If not super admin, don't render anything
  if (userProfile?.role !== 'super_admin') {
    return null
  }

  // Find the EdriziAI voice template
  const edriziVoice = VOICE_TEMPLATES.find(v => v.id === 'EdriziAI-info')
  if (!edriziVoice) {
    console.error('EdriziAI voice template not found')
    return null
  }

  return <SuperAdminVoiceContainer edriziVoice={edriziVoice} />
}
