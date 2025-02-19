import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Mic, Square, Upload, Volume2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'

export const VoiceAssistant = () => {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Fout",
        description: "Alleen audiobestanden zijn toegestaan",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    const reader = new FileReader()
    
    reader.onloadend = async () => {
      await processAudio(reader.result as string)
    }
    
    reader.readAsDataURL(file)
  }

  const processAudio = async (audioData: string) => {
    setIsProcessing(true)
    try {
      const base64Data = audioData.split('base64,')[1] || audioData

      const { data, error } = await supabase.functions.invoke('process-voice', {
        body: { audioData: base64Data }
      })

      if (error) {
        console.error('Supabase function error:', error)
        throw error
      }

      if (!data?.transcription) {
        throw new Error('Geen transcriptie ontvangen')
      }

      setLastTranscription(data.transcription)
      
      toast({
        title: "Verwerkt",
        description: data.transcription,
      })
    } catch (error) {
      console.error('Error processing audio:', error)
      toast({
        title: "Fout",
        description: "Kon audio niet verwerken. Probeer het opnieuw.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const playTranscription = async () => {
    if (!lastTranscription || isPlaying) return
    
    setIsPlaying(true)
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: lastTranscription }
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
          description: "De tekst wordt voorgelezen...",
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

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">Spraak Assistent</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex justify-center space-x-4">
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
          
          <Button
            onClick={triggerFileUpload}
            disabled={isProcessing || isRecording}
            variant="outline"
          >
            <Upload className="w-6 h-6 mr-2" />
            Upload Audio
          </Button>

          {lastTranscription && (
            <Button
              onClick={playTranscription}
              disabled={isProcessing || isRecording || isPlaying}
              variant="outline"
            >
              <Volume2 className="w-6 h-6 mr-2" />
              Afspelen
            </Button>
          )}
        </div>
        
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileUpload}
        />
        
        {isProcessing && (
          <p className="text-center text-sm text-muted-foreground">
            Audio wordt verwerkt...
          </p>
        )}

        {lastTranscription && (
          <p className="text-center text-sm">
            {lastTranscription}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
