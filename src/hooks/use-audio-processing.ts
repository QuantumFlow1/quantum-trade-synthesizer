
import { useState } from 'react'
import { useToast } from './use-toast'
import { supabase } from '@/lib/supabase'
import { VoiceTemplate } from '@/lib/types'

export const useAudioProcessing = (
  selectedVoice: VoiceTemplate,
  previewAudioUrl: string | null,
  setLastTranscription: (transcription: string) => void
) => {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const processAudio = async () => {
    if (!previewAudioUrl) return

    setIsProcessing(true)
    try {
      const response = await fetch(previewAudioUrl)
      const blob = await response.blob()
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split('base64,')[1]
        
        const { data, error } = await supabase.functions.invoke('process-voice', {
          body: { 
            audioData: base64Data,
            voiceTemplate: selectedVoice.prompt
          }
        })

        if (error) throw error

        if (!data?.transcription) {
          throw new Error('Geen transcriptie ontvangen')
        }

        setLastTranscription(data.transcription)
        
        toast({
          title: "Verwerkt",
          description: data.transcription,
        })
      }
      
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error('Error processing audio:', error)
      toast({
        title: "Fout",
        description: "Kon audio niet verwerken. Probeer het opnieuw.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    isProcessing,
    processAudio
  }
}
