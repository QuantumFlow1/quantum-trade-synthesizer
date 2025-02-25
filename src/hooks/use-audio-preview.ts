
import { useState, useRef } from 'react'
import { useToast } from './use-toast'

export const useAudioPreview = () => {
  const { toast } = useToast()
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

  const playPreview = async () => {
    if (!previewAudioUrl || isPreviewPlaying) return

    if (previewAudioRef.current) {
      try {
        setIsPreviewPlaying(true)
        await previewAudioRef.current.play()
      } catch (error) {
        console.error('Error playing preview:', error)
        toast({
          title: "Fout",
          description: "Kon de audio preview niet afspelen",
          variant: "destructive",
        })
      }
    }
  }

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause()
      previewAudioRef.current.currentTime = 0
      setIsPreviewPlaying(false)
    }
  }

  return {
    previewAudioUrl,
    setPreviewAudioUrl,
    isPreviewPlaying,
    setIsPreviewPlaying,
    previewAudioRef,
    playPreview,
    stopPreview
  }
}
