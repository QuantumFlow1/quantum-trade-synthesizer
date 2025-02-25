
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
        
        // Log which voice template is being used
        console.log(`Processing audio with voice template: ${selectedVoice.name} (${selectedVoice.id})`)
        
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

        // Log the transcription that was received
        console.log(`Transcription received: ${data.transcription}`)
        
        setLastTranscription(data.transcription)
        
        toast({
          title: `${selectedVoice.name} heeft geantwoord`,
          description: data.transcription.substring(0, 100) + (data.transcription.length > 100 ? '...' : ''),
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
