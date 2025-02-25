
import { useToast } from '@/hooks/use-toast'

export const createAndPlayAudioBlob = async (
  audioContent: string,
  text: string,
  voiceName: string,
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (isPlaying: boolean) => void,
  setIsProcessing: (isProcessing: boolean) => void
): Promise<void> => {
  const { toast } = useToast()
  
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
        console.error('Error playing audio:', playError)
        toast({
          title: "Playback Error",
          description: "Could not play the audio. Please try again.",
          variant: "destructive",
        })
        setIsPlaying(false)
        setIsProcessing(false)
      }
    } else {
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      audio.onended = () => {
        setIsPlaying(false)
        setIsProcessing(false)
        URL.revokeObjectURL(audioUrl)
      }
      
      console.log('Playing audio with new Audio element...')
      try {
        await audio.play()
      } catch (playError) {
        console.error('Error playing audio with new Audio element:', playError)
        toast({
          title: "Playback Error",
          description: "Could not play the audio. Please try again.",
          variant: "destructive",
        })
        setIsPlaying(false)
        setIsProcessing(false)
      }
    }

    toast({
      title: `${voiceName} spreekt`,
      description: text.length > 60 ? `${text.substring(0, 60)}...` : text,
    })
  } catch (blobError) {
    console.error('Error creating audio blob:', blobError)
    toast({
      title: "Audio Processing Error",
      description: "Could not process the audio data.",
      variant: "destructive",
    })
    setIsPlaying(false)
    setIsProcessing(false)
  }
}
