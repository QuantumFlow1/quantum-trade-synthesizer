
import { supabase } from '@/lib/supabase'
import { VoiceTemplate } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

/**
 * Generates speech from text using the text-to-speech API
 */
export const generateSpeechFromText = async (
  text: string, 
  selectedVoice: VoiceTemplate,
  playAudio: (url: string) => void,
  setProcessingStage: (stage: string) => void,
  setProcessingError: (error: string | null) => void
): Promise<boolean> => {
  const { toast } = useToast()
  
  try {
    console.log('Starting speech generation with text:', text.substring(0, 100) + '...')
    setProcessingStage('Converting to speech')
    setProcessingError(null)
    
    // Create a controller for fetch request - will enable cancellation later if needed
    const controller = new AbortController()
    
    // More detailed request logging
    console.log('Sending request to text-to-speech function with voice ID:', selectedVoice.id)
    
    const startTime = performance.now()
    const { data: speechData, error: speechError } = await supabase.functions.invoke('text-to-speech', {
      body: { 
        text, 
        voiceId: selectedVoice.id 
      }
    })
    const requestTime = performance.now() - startTime
    console.log(`TTS request completed in ${requestTime.toFixed(0)}ms`)

    if (speechError) {
      console.error('Error from text-to-speech function:', speechError)
      setProcessingError('Failed to generate speech. Please try again.')
      toast({
        title: "Speech Generation Error",
        description: "Failed to generate speech response. Please try again.",
        variant: "destructive",
      })
      return false
    }

    // Verify we have the audioContent in the response
    if (!speechData?.audioContent) {
      console.error('No audioContent in response:', speechData)
      setProcessingError('No audio response received. Please try again.')
      toast({
        title: "Speech Generation Error",
        description: "No audio content received from speech service. Please try again.",
        variant: "destructive",
      })
      return false
    }

    console.log('Received audioContent, converting to URL')
    
    // Convert the base64 audio content to a playable URL - optimized for performance
    try {
      const audioBlob = await fetch(`data:audio/mp3;base64,${speechData.audioContent}`).then(r => r.blob())
      const audioUrl = URL.createObjectURL(audioBlob)
      
      // Play the generated audio
      console.log('Playing audio with URL:', audioUrl)
      playAudio(audioUrl)
      return true
    } catch (conversionError) {
      console.error('Error converting audio content to URL:', conversionError)
      setProcessingError('Error processing audio data. Please try again.')
      toast({
        title: "Audio Processing Error",
        description: "Failed to process audio data. Please try again.",
        variant: "destructive",
      })
      return false
    }
  } catch (error) {
    console.error('Unexpected error in text-to-speech flow:', error)
    setProcessingError('An unexpected error occurred while generating speech.')
    toast({
      title: "Speech Generation Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    })
    return false
  }
}
