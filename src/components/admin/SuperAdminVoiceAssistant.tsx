
import { useAuth } from '@/components/auth/AuthProvider'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { SuperAdminVoiceContainer } from './voice-assistant/SuperAdminVoiceContainer'
import { useEffect } from 'react'

export const SuperAdminVoiceAssistant = () => {
  const { userProfile } = useAuth()
  
  // If not super admin, don't render anything
  if (userProfile?.role !== 'super_admin') {
    return null
  }

  // Log that this component is rendering - for debugging
  useEffect(() => {
    console.log('SuperAdminVoiceAssistant component is rendering')
  }, [])

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
    console.log('Using fallback voice template:', fallbackVoice.name)
    return <SuperAdminVoiceContainer edriziVoice={fallbackVoice} />
  }

  console.log('Using admin voice template:', edriziAdminVoice.name)
  return <SuperAdminVoiceContainer edriziVoice={edriziAdminVoice} />
}
