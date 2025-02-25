
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
        
        // First get the transcription of what the user said
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('process-voice', {
          body: { 
            audioData: base64Data,
            voiceTemplate: selectedVoice.prompt
          }
        })

        if (transcriptionError) throw transcriptionError

        if (!transcriptionData?.transcription) {
          throw new Error('Geen transcriptie ontvangen')
        }

        // Log the transcription that was received
        console.log(`Transcription received: ${transcriptionData.transcription}`)
        
        // For EdriziAI model, process through the AI response generator
        if (selectedVoice.id === 'EdriziAI-info') {
          console.log('Using AI response generator for EdriziAI')
          
          try {
            const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
              body: {
                prompt: transcriptionData.transcription,
                voiceId: selectedVoice.id
              }
            })
            
            if (aiError) {
              console.error('AI response error:', aiError)
              throw aiError
            }
            
            if (aiData?.response) {
              console.log(`AI response: ${aiData.response}`)
              setLastTranscription(aiData.response)
              
              toast({
                title: `${selectedVoice.name} heeft geantwoord`,
                description: aiData.response.substring(0, 100) + (aiData.response.length > 100 ? '...' : ''),
              })
              
              return
            }
          } catch (aiProcessingError) {
            console.error('Error processing with AI:', aiProcessingError)
            // Fall back to regular transcription if AI processing fails
          }
        }
        
        // For other voice models, or if AI processing failed, just use the transcription
        setLastTranscription(transcriptionData.transcription)
        
        toast({
          title: `${selectedVoice.name} heeft geantwoord`,
          description: transcriptionData.transcription.substring(0, 100) + (transcriptionData.transcription.length > 100 ? '...' : ''),
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
