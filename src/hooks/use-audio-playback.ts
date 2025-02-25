
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
    console.log(`Attempting to play audio with voice ID: ${voiceId}, name: ${voiceName}`)
    console.log(`Text to speak: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`)
    
    try {
      // For EdriziAI, process the text through the AI first
      let textToSpeak = text;
      
      if (voiceId === 'EdriziAI-info') {
        console.log('Processing text with AI before speaking for EdriziAI')
        
        try {
          const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
            body: {
              prompt: text,
              voiceId: voiceId
            }
          })
          
          if (aiError) {
            console.error('AI processing error:', aiError)
            toast({
              title: "AI Fout",
              description: "Er was een probleem bij het genereren van een AI-antwoord",
              variant: "destructive",
            })
          } else if (aiData?.response) {
            console.log(`AI generated response: ${aiData.response}`)
            textToSpeak = aiData.response
          } else {
            console.error('No AI response received')
          }
        } catch (aiError) {
          console.error('Failed to process with AI, using original text:', aiError)
        }
      }
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: textToSpeak,
          voiceId
        }
      })

      if (error) {
        console.error('Supabase function error:', error)
        throw error
      }

      if (!data?.audioContent) {
        console.error('No audio content returned from API')
        throw new Error('Geen audio ontvangen van de server')
      }

      console.log('Audio content received successfully')
      const audioBlob = await fetch(`data:audio/mp3;base64,${data.audioContent}`).then(r => r.blob())
      const audioUrl = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.onended = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
        }
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
        title: `${voiceName} spreekt`,
        description: textToSpeak.length > 60 ? `${textToSpeak.substring(0, 60)}...` : textToSpeak,
      })
    } catch (error) {
      console.error('Error playing audio:', error)
      toast({
        title: "Fout",
        description: "Kon de tekst niet afspelen",
        variant: "destructive",
      })
      setIsPlaying(false)
    }
  }

  return {
    isPlaying,
    playAudio
  }
}
