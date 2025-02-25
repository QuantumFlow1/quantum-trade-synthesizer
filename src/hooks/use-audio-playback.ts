
import { useState, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

export const useAudioPlayback = () => {
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = async (text: string, voiceId: string, voiceName: string) => {
    if (!text || isPlaying || isProcessing) return
    
    setIsPlaying(true)
    setIsProcessing(true)
    console.log(`Attempting to play audio with voice ID: ${voiceId}, name: ${voiceName}`)
    console.log(`Text to speak: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`)
    
    try {
      // For EdriziAI voice processing
      let textToSpeak = text;
      
      // Only process AI responses for EdriziAI voices
      if (voiceId.includes('EdriziAI')) {
        console.log(`Processing text with AI before speaking for ${voiceName}`)
        
        try {
          // Pre-process to handle URL or web access mentions
          if (text.includes('http') || text.includes('www.') || 
              text.includes('website') || text.includes('link') || 
              text.includes('open') || text.includes('browse')) {
            console.log('Detected possible web access request, handling specially')
            
            // Create a friendly response explaining limitations
            const webRequestResponse = "Ik kan geen externe websites openen of bezoeken. Als AI-assistent kan ik geen toegang krijgen tot internet links of webpagina's. Ik kan je wel helpen met trading informatie, analyse en educatie op basis van mijn training. Hoe kan ik je verder helpen met je trading vragen?"
            
            textToSpeak = webRequestResponse
          } else {
            // Regular processing path - First try Grok3 API for advanced responses
            console.log('Attempting to use Grok3 API first...')
            const { data: grokData, error: grokError } = await supabase.functions.invoke('grok3-response', {
              body: {
                message: text,
                context: []
              }
            })
            
            if (grokError) {
              console.error('Grok3 API error:', grokError)
              console.log('Falling back to standard AI processing...')
              
              // Fallback to generate-ai-response function if Grok3 fails
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
            } else if (grokData?.response) {
              console.log(`Grok3 generated response: ${grokData.response}`)
              textToSpeak = grokData.response
            } else {
              console.log('No Grok3 response received, using fallback')
              
              // Fallback to generate-ai-response if Grok3 returns no data
              const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
                body: {
                  prompt: text,
                  voiceId: voiceId
                }
              })
              
              if (aiError) {
                console.error('AI processing error:', aiError)
              } else if (aiData?.response) {
                console.log(`AI generated response: ${aiData.response}`)
                textToSpeak = aiData.response
              }
            }
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
        setIsProcessing(false)
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
        setIsProcessing(false)
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
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Error in audio playback flow:', error)
      toast({
        title: "Fout",
        description: "Kon de tekst niet afspelen",
        variant: "destructive",
      })
      setIsPlaying(false)
      setIsProcessing(false)
    }
  }

  return {
    isPlaying,
    isProcessing,
    playAudio
  }
}
