
import { useState, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

export const useAudioPlayback = () => {
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = async (text: string, voiceId: string, voiceName: string) => {
    if (!text || isPlaying) return
    
    setIsPlaying(true)
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voiceId
        }
      })

      if (error) throw error

      if (data?.audioContent) {
        const audioBlob = await fetch(`data:audio/mp3;base64,${data.audioContent}`).then(r => r.blob())
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl
          await audioRef.current.play()
        } else {
          const audio = new Audio(audioUrl)
          audioRef.current = audio
          audio.onended = () => {
            setIsPlaying(false)
            URL.revokeObjectURL(audioUrl)
          }
          await audio.play()
        }

        toast({
          title: "Afspelen",
          description: `Voorgelezen door ${voiceName}`,
        })
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      toast({
        title: "Fout",
        description: "Kon de tekst niet afspelen",
        variant: "destructive",
      })
    } finally {
      setIsPlaying(false)
    }
  }

  return {
    isPlaying,
    playAudio
  }
}
