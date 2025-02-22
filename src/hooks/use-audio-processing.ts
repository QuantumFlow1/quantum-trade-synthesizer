
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { VoiceTemplate } from '@/lib/types'

export const useAudioProcessing = () => {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTranscription, setLastTranscription] = useState<string>('')

  const processAudio = async (previewAudioUrl: string, selectedVoice: VoiceTemplate) => {
    if (!previewAudioUrl) {
      console.error('Geen audio URL opgegeven')
      return
    }

    setIsProcessing(true)
    console.log('Start audio verwerking:', new Date().toISOString())
    
    try {
      const response = await fetch(previewAudioUrl)
      const blob = await response.blob()
      
      // Log bestandsgrootte voor debugging
      console.log(`Audio bestandsgrootte: ${(blob.size / 1024 / 1024).toFixed(2)}MB`)
      
      if (blob.size > 25 * 1024 * 1024) {
        throw new Error('Audiobestand is te groot (max 25MB)')
      }

      // Chunk processing voor grote bestanden
      const chunkSize = 1024 * 1024 // 1MB chunks
      const reader = new FileReader()
      
      const processChunk = (start: number) => {
        return new Promise((resolve, reject) => {
          const chunk = blob.slice(start, start + chunkSize)
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(chunk)
        })
      }

      // Process in chunks
      const chunks: string[] = []
      for (let start = 0; start < blob.size; start += chunkSize) {
        const chunk = await processChunk(start) as string
        chunks.push(chunk.split('base64,')[1])
        console.log(`Chunk ${chunks.length} verwerkt (${start + chunkSize}/${blob.size} bytes)`)
      }

      const base64Data = chunks.join('')
      console.log('Audio data voorbereid voor verwerking')

      const { data, error } = await supabase.functions.invoke('process-voice', {
        body: { 
          audioData: base64Data,
          voiceTemplate: selectedVoice.prompt
        }
      })

      if (error) {
        console.error('Supabase functie error:', error)
        throw error
      }

      if (!data?.transcription) {
        console.error('Geen transcriptie ontvangen van de server')
        throw new Error('Geen transcriptie ontvangen')
      }

      console.log('Transcriptie succesvol ontvangen:', data.transcription.length, 'karakters')
      setLastTranscription(data.transcription)
      
      toast({
        title: "Verwerkt",
        description: data.transcription,
      })
    } catch (error) {
      console.error('Error tijdens audio verwerking:', error)
      let errorMessage = 'Kon audio niet verwerken. Probeer het opnieuw.'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "Fout",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      console.log('Audio verwerking afgerond:', new Date().toISOString())
      setIsProcessing(false)
    }
  }

  return {
    isProcessing,
    lastTranscription,
    processAudio,
    setLastTranscription
  }
}
