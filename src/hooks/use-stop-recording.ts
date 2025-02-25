
import { useState } from 'react'
import { useToast } from './use-toast'
import { supabase } from '@/lib/supabase'
import { VoiceTemplate } from '@/lib/types'

type StopRecordingProps = {
  stopRecording: () => Promise<string | null>
  setPreviewAudioUrl: (url: string | null) => void
  processAudio: () => void
  selectedVoice: VoiceTemplate
  setLastUserInput: (input: string) => void
}

export const useStopRecording = ({
  stopRecording,
  setPreviewAudioUrl,
  processAudio,
  selectedVoice,
  setLastUserInput
}: StopRecordingProps) => {
  const { toast } = useToast()
  const [isStoppingRecording, setIsStoppingRecording] = useState(false)

  const handleStopRecording = async () => {
    if (isStoppingRecording) return
    
    setIsStoppingRecording(true)
    try {
      const audioUrl = await stopRecording()
      console.log('Recording stopped, audioUrl:', audioUrl ? 'received' : 'not received')
      
      if (audioUrl) {
        setPreviewAudioUrl(audioUrl)
        console.log('Recording stopped, processing audio...')
        
        // First get the transcription
        const response = await fetch(audioUrl)
        const blob = await response.blob()
        const reader = new FileReader()
        
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split('base64,')[1]
          
          // Get transcription 
          console.log('Getting transcription for audio...')
          const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('process-voice', {
            body: { 
              audioData: base64Data,
              voiceTemplate: selectedVoice.prompt
            }
          })
          
          if (transcriptionError) {
            console.error('Transcription error:', transcriptionError)
            toast({
              title: "Error",
              description: "Failed to transcribe recording",
              variant: "destructive"
            })
          } else if (transcriptionData?.transcription) {
            console.log(`User said: ${transcriptionData.transcription}`)
            setLastUserInput(transcriptionData.transcription)
          } else {
            console.error('No transcription received')
          }
          
          // Then process with AI
          console.log('Processing audio for AI response...')
          processAudio()
        }
        
        reader.readAsDataURL(blob)
      }
    } catch (error) {
      console.error('Error stopping recording:', error)
      toast({
        title: "Error",
        description: "Failed to process recording",
        variant: "destructive"
      })
    } finally {
      setIsStoppingRecording(false)
    }
  }

  return {
    handleStopRecording,
    isStoppingRecording
  }
}
