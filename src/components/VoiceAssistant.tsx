
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Mic, Square, Volume2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

export const VoiceAssistant = () => {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const audioPlayer = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
        const reader = new FileReader()
        
        reader.onloadend = async () => {
          await processAudio(reader.result as string)
        }
        
        reader.readAsDataURL(audioBlob)
      }

      mediaRecorder.current.start()
      setIsRecording(true)
      
      toast({
        title: "Recording started",
        description: "Speak now...",
      })
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const processAudio = async (audioData: string) => {
    setIsProcessing(true)
    try {
      const { data, error } = await supabase.functions.invoke('process-voice', {
        body: { audioData }
      })

      if (error) throw error

      // Play the response
      if (data.audioResponse) {
        audioPlayer.current = new Audio(data.audioResponse)
        await audioPlayer.current.play()
      }

      toast({
        title: "Processed",
        description: data.transcription,
      })
    } catch (error) {
      console.error('Error processing audio:', error)
      toast({
        title: "Error",
        description: "Failed to process audio",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">Spraak Assistent</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isProcessing}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Mic className="w-6 h-6 mr-2" />
            Start Opname
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
          >
            <Square className="w-6 h-6 mr-2" />
            Stop Opname
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
