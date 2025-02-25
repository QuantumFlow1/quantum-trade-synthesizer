
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'
import { handleTranscriptionError } from './errorHandlingUtils'

/**
 * Transcribes audio from a URL
 */
export const transcribeAudio = async (
  audioUrl: string,
  setProcessingStage: (stage: string) => void,
  setProcessingError: (error: string | null) => void
): Promise<string | null> => {
  try {
    // Show immediate feedback to user
    toast({
      title: "Verwerken",
      description: "Audio wordt getranscribeerd...",
    })
    
    // First step: Process voice to get transcription
    console.log('Starting audio transcription')
    
    const startTranscribeTime = performance.now()
    const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('process-voice', {
      body: { audioUrl }
    })
    const transcribeTime = performance.now() - startTranscribeTime
    console.log(`Transcription completed in ${transcribeTime.toFixed(0)}ms`)

    if (transcriptionError) {
      console.error('Error processing voice:', transcriptionError)
      setProcessingError('Failed to transcribe audio. Please try again.')
      toast({
        title: "Transcription Error",
        description: "Could not process your audio. Please try again.",
        variant: "destructive",
      })
      return null
    }

    const transcription = transcriptionData?.transcription
    if (!transcription) {
      console.error('No transcription returned from service:', transcriptionData)
      setProcessingError('No transcription could be generated from your audio.')
      toast({
        title: "Transcription Error",
        description: "No transcription returned. Please speak clearly and try again.",
        variant: "destructive",
      })
      return null
    }

    console.log('Got transcription:', transcription)
    return transcription
  } catch (error) {
    handleTranscriptionError(error, setProcessingError)
    return null
  }
}
