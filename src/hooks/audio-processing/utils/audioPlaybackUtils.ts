
import { toast } from '@/components/ui/use-toast'
import { handlePlaybackError, handleAudioProcessingError } from './errorHandlingUtils'

export const createAndPlayAudioBlob = async (
  audioContent: string,
  text: string,
  voiceName: string,
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (isPlaying: boolean) => void,
  setIsProcessing: (isProcessing: boolean) => void
): Promise<void> => {
  const options = { setIsPlaying, setIsProcessing }
  
  try {
    const audioBlob = await fetch(`data:audio/mp3;base64,${audioContent}`).then(r => r.blob())
    const audioUrl = URL.createObjectURL(audioBlob)
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.onended = () => {
        setIsPlaying(false)
        setIsProcessing(false)
        URL.revokeObjectURL(audioUrl)
      }
      
      console.log('Playing audio...')
      try {
        await audioRef.current.play()
      } catch (playError) {
        handlePlaybackError(playError, options)
      }
    } else {
      const audio = new Audio(audioUrl)
      // Use instead of direct assignment to readonly property
      if (audioRef) {
        Object.defineProperty(audioRef, 'current', {
          writable: true,
          value: audio
        })
      }
      
      audio.onended = () => {
        setIsPlaying(false)
        setIsProcessing(false)
        URL.revokeObjectURL(audioUrl)
      }
      
      console.log('Playing audio with new Audio element...')
      try {
        await audio.play()
      } catch (playError) {
        handlePlaybackError(playError, options)
      }
    }

    toast({
      title: `${voiceName} spreekt`,
      description: text.length > 60 ? `${text.substring(0, 60)}...` : text,
    })
  } catch (blobError) {
    handleAudioProcessingError(blobError, options)
  }
}
