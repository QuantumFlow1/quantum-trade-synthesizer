
import { useAuth } from '@/components/auth/AuthProvider'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { SuperAdminVoiceContainer } from './voice-assistant/SuperAdminVoiceContainer'
import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export const SuperAdminVoiceAssistant = () => {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  
  // If not super admin, don't render anything
  if (userProfile?.role !== 'super_admin') {
    return null
  }

  // Log that this component is rendering - for debugging
  useEffect(() => {
    console.log('SuperAdminVoiceAssistant component is rendering')
    
    // Check if we have the appropriate API keys set
    const checkApiKeys = async () => {
      try {
        const { data, error } = await fetch('/api/check-api-keys').then(res => res.json())
        
        if (error || !data?.grok3ApiKeySet) {
          toast({
            title: "API Sleutel Ontbreekt",
            description: "Controleer of je Grok3 API-sleutel correct is ingesteld in Supabase Edge Function secrets.",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error('Failed to check API keys:', err)
      }
    }
    
    // Uncomment this to check API keys on load if needed
    // checkApiKeys()
  }, [toast])

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
