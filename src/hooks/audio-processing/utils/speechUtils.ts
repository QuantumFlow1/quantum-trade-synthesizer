
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
      setProcessingError('Missing required parameters for speech generation')
      return
    }
    
    setProcessingStage('Generating speech')
    console.log('Generating speech for text:', text.substring(0, 100))
    console.log('Using voice:', selectedVoice.name, 'with ID:', selectedVoice.id)
    
    // Create a controller for fetch request - will enable cancellation later if needed
    const controller = new AbortController()
    
    const startTime = performance.now()
    
    // Make the request to the text-to-speech function
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

    // Validate the response data
    if (!speechData) {
      console.error('No response data from TTS service')
      setProcessingError('No response received from speech service')
      return
    }

    // Check for audioContent in the response
    if (!speechData.audioContent) {
      console.error('No audio content in response:', speechData)
      setProcessingError('No audio content received from speech service')
      return
    }

    // Create audio URL from base64 content
    const audioBlob = await fetch(`data:audio/mp3;base64,${speechData.audioContent}`).then(r => r.blob())
    const audioUrl = URL.createObjectURL(audioBlob)
    console.log('Created audio URL from base64 content')

    // Play the audio
    setProcessingStage('Playing audio response')
    playAudio(audioUrl)
    
    // Clean up the URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(audioUrl)
    }, 30000) // Cleanup after 30 seconds
    
  } catch (error) {
    console.error('Error in speech generation:', error)
    setProcessingError('An unexpected error occurred during speech generation.')
  }
}
