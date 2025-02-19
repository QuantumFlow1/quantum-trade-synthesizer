
import { useState, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

export const useAudioRecorder = () => {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.start()
      setIsRecording(true)
      
      toast({
        title: "Opname gestart",
        description: "Spreek nu...",
      })
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast({
        title: "Fout",
        description: "Kon geen toegang krijgen tot de microfoon",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      return new Promise<string>((resolve) => {
        mediaRecorder.current!.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm;codecs=opus' })
          const audioUrl = URL.createObjectURL(audioBlob)
          resolve(audioUrl)
        }
        
        mediaRecorder.current!.stop()
        mediaRecorder.current!.stream.getTracks().forEach(track => track.stop())
        setIsRecording(false)
      })
    }
    return Promise.resolve(null)
  }

  return {
    isRecording,
    startRecording,
    stopRecording
  }
}
