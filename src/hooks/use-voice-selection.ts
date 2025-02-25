
import { useState } from 'react'
import { useToast } from './use-toast'
import { VoiceTemplate } from '@/lib/types'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'

export const useVoiceSelection = () => {
  // Find and default to EdriziAI voice model for super admins
  const defaultVoice = VOICE_TEMPLATES.find(v => v.id === "EdriziAI-info") || VOICE_TEMPLATES[0]
  const [selectedVoice, setSelectedVoice] = useState<VoiceTemplate>(defaultVoice)

  const { toast } = useToast()

  const handleVoiceChange = (voiceId: string) => {
    const voice = VOICE_TEMPLATES.find(v => v.id === voiceId)
    if (voice) {
      console.log(`Switching to voice: ${voice.name} (ID: ${voice.id})`)
      setSelectedVoice(voice)
      toast({
        title: "Voice Changed",
        description: `You are now using ${voice.name}`
      })
    }
  }

  return {
    selectedVoice,
    handleVoiceChange
  }
}
