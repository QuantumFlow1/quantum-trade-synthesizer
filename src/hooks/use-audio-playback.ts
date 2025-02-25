
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
      
      // Log the request to text-to-speech function
      console.log(`Sending to text-to-speech: ${textToSpeak.substring(0, 100)}...`)
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: textToSpeak,
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
        return
      }

      if (!data?.audioContent) {
        console.error('No audio content returned from API:', data)
        toast({
          title: "Speech Generation Error",
          description: "No audio received from the server",
          variant: "destructive",
        })
        setIsPlaying(false)
        return
      }

      console.log('Audio content received successfully, creating blob URL')
      
      try {
        const audioBlob = await fetch(`data:audio/mp3;base64,${data.audioContent}`).then(r => r.blob())
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.onended = () => {
            setIsPlaying(false)
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
          }
        } else {
          const audio = new Audio(audioUrl)
          audioRef.current = audio
          audio.onended = () => {
            setIsPlaying(false)
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
          }
        }

        toast({
          title: `${voiceName} spreekt`,
          description: textToSpeak.length > 60 ? `${textToSpeak.substring(0, 60)}...` : textToSpeak,
        })
      } catch (blobError) {
        console.error('Error creating audio blob:', blobError)
        toast({
          title: "Audio Processing Error",
          description: "Could not process the audio data.",
          variant: "destructive",
        })
        setIsPlaying(false)
      }
    } catch (error) {
      console.error('Error in audio playback flow:', error)
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
