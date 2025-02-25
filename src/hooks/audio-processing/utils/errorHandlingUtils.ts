
import { useToast } from '@/hooks/use-toast'

interface ErrorHandlingOptions {
  setIsPlaying?: (isPlaying: boolean) => void
  setIsProcessing?: (isProcessing: boolean) => void
}

export const handleSpeechGenerationError = (
  error: any, 
  context: string, 
  options?: ErrorHandlingOptions
) => {
  const { toast } = useToast()
  console.error(`Error in ${context}:`, error)
  
  toast({
    title: "Speech Generation Error",
    description: error?.message || "An unexpected error occurred",
    variant: "destructive",
  })
  
  // Reset state if needed
  if (options?.setIsPlaying) {
    options.setIsPlaying(false)
  }
  
  if (options?.setIsProcessing) {
    options.setIsProcessing(false)
  }
  
  return null
}

export const handlePlaybackError = (
  error: any, 
  options?: ErrorHandlingOptions
) => {
  const { toast } = useToast()
  console.error('Error playing audio:', error)
  
  toast({
    title: "Playback Error",
    description: "Could not play the audio. Please try again.",
    variant: "destructive",
  })
  
  // Reset state if needed
  if (options?.setIsPlaying) {
    options.setIsPlaying(false)
  }
  
  if (options?.setIsProcessing) {
    options.setIsProcessing(false)
  }
}

export const handleAudioProcessingError = (
  error: any, 
  options?: ErrorHandlingOptions
) => {
  const { toast } = useToast()
  console.error('Error in audio processing:', error)
  
  toast({
    title: "Audio Processing Error",
    description: "Could not process the audio data.",
    variant: "destructive",
  })
  
  // Reset state if needed
  if (options?.setIsPlaying) {
    options.setIsPlaying(false)
  }
  
  if (options?.setIsProcessing) {
    options.setIsProcessing(false)
  }
}
