
import { supabase } from "@/lib/supabase"
import { useToast } from '@/hooks/use-toast'

export const generateSpeechFromText = async (
  text: string,
  voiceId: string,
  voiceName: string,
  setIsPlaying: (isPlaying: boolean) => void,
  setIsProcessing: (isProcessing: boolean) => void
) => {
  const { toast } = useToast()
  console.log(`Attempting to play audio with voice ID: ${voiceId}, name: ${voiceName}`)
  console.log(`Text to speak: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`)

  try {
    // Log the request to text-to-speech function
    console.log(`Sending to text-to-speech: ${text.substring(0, 100)}...`)
    
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { 
        text,
        voiceId
      }
    })

    if (error) {
      console.error('Supabase function error:', error)
      toast({
        title: "Speech Generation Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      })
      setIsPlaying(false)
      setIsProcessing(false)
      return null
    }

    if (!data?.audioContent) {
      console.error('No audio content returned from API:', data)
      toast({
        title: "Speech Generation Error",
        description: "No audio received from the server",
        variant: "destructive",
      })
      setIsPlaying(false)
      setIsProcessing(false)
      return null
    }

    console.log('Audio content received successfully')
    return data.audioContent
  } catch (error) {
    console.error('Error in speech generation:', error)
    toast({
      title: "Speech Generation Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    })
    setIsPlaying(false)
    setIsProcessing(false)
    return null
  }
}
