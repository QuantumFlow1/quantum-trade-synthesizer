
import { supabase } from "@/lib/supabase"
import { VoiceTemplate } from "@/lib/types"

/**
 * Generates speech from text using selected voice
 */
export const generateSpeechFromText = async (
  text: string,
  selectedVoice: VoiceTemplate,
  playAudio: (url: string) => void,
  setProcessingStage: (stage: string) => void,
  setProcessingError: (error: string | null) => void
): Promise<void> => {
  try {
    if (!text || !selectedVoice) {
      console.error('Missing required parameters for speech generation')
      return
    }
    
    setProcessingStage('Generating speech')
    
    // Create a controller for fetch request - will enable cancellation later if needed
    const controller = new AbortController()
    
    // More detailed request logging
    console.log('Sending request to text-to-speech function with voice ID:', selectedVoice.id)
    
    const startTime = performance.now()
    // Remove the signal property from function options
    const { data: speechData, error: speechError } = await supabase.functions.invoke('text-to-speech', {
      body: { 
        text, 
        voiceId: selectedVoice.id 
      }
    })
    const requestTime = performance.now() - startTime
    console.log(`TTS request completed in ${requestTime.toFixed(0)}ms`)

    if (speechError) {
      console.error('Text-to-speech error:', speechError)
      setProcessingError('Failed to generate speech. Please try again.')
      return
    }

    if (!speechData?.audioUrl) {
      console.error('No audio URL returned from TTS service')
      setProcessingError('No audio was generated. Please try again.')
      return
    }

    // Get the audio URL
    const audioUrl = speechData.audioUrl
    console.log('Audio URL generated:', audioUrl)

    // Play the audio
    setProcessingStage('Playing audio response')
    playAudio(audioUrl)
  } catch (error) {
    console.error('Error generating speech:', error)
    setProcessingError('An error occurred during speech generation.')
  }
}
