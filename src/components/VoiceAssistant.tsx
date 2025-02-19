import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Mic, Square, Upload, Volume2, User, Bot, Loader2, PlayCircle, StopCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const VOICE_TEMPLATES = [
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "Professionele stem",
    prompt: "Je bent Rachel, een professionele AI assistent die altijd beleefd en behulpzaam is."
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Demi",
    description: "Vriendelijke stem",
    prompt: "Je bent Demi, een vriendelijke en enthousiaste AI assistent die mensen graag helpt."
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Sarah",
    description: "Zakelijke stem",
    prompt: "Je bent Sarah, een zakelijke AI assistent die efficiënt en direct communiceert."
  },
  {
    id: "MF3mGyEYCl7XYWbV9V6O",
    name: "Finn",
    description: "Informele stem",
    prompt: "Je bent Finn, een informele AI assistent die op een ontspannen manier communiceert."
  }
]

export const VoiceAssistant = () => {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(VOICE_TEMPLATES[0])
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

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
        const audioUrl = URL.createObjectURL(audioBlob)
        setPreviewAudioUrl(audioUrl)
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

      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
      const audioUrl = URL.createObjectURL(audioBlob)
      setPreviewAudioUrl(audioUrl)
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

    const audioUrl = URL.createObjectURL(file)
    setPreviewAudioUrl(audioUrl)
  }

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

  const processAudio = async () => {
    if (!previewAudioUrl) return

    setIsProcessing(true)
    try {
      const response = await fetch(previewAudioUrl)
      const blob = await response.blob()
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split('base64,')[1]
        
        const { data, error } = await supabase.functions.invoke('process-voice', {
          body: { 
            audioData: base64Data,
            voiceTemplate: selectedVoice.prompt
          }
        })

        if (error) throw error

        if (!data?.transcription) {
          throw new Error('Geen transcriptie ontvangen')
        }

        setLastTranscription(data.transcription)
        
        toast({
          title: "Verwerkt",
          description: data.transcription,
        })
      }
      
      reader.readAsDataURL(blob)
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
        body: { 
          text: lastTranscription,
          voiceId: selectedVoice.id
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
          description: `Voorgelezen door ${selectedVoice.name}`,
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
        <CardTitle className="text-center">AI Spraak Assistent</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-4 h-4" />
          <Select
            value={selectedVoice.id}
            onValueChange={(value) => {
              const voice = VOICE_TEMPLATES.find(v => v.id === value)
              if (voice) setSelectedVoice(voice)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Kies een stem" />
            </SelectTrigger>
            <SelectContent>
              {VOICE_TEMPLATES.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name} - {voice.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

          {previewAudioUrl && !isPreviewPlaying && (
            <Button
              onClick={playPreview}
              variant="outline"
            >
              <PlayCircle className="w-6 h-6 mr-2" />
              Preview
            </Button>
          )}

          {previewAudioUrl && isPreviewPlaying && (
            <Button
              onClick={stopPreview}
              variant="outline"
            >
              <StopCircle className="w-6 h-6 mr-2" />
              Stop
            </Button>
          )}

          {previewAudioUrl && (
            <Button
              onClick={processAudio}
              disabled={isProcessing}
              variant="secondary"
            >
              Verwerk Audio
            </Button>
          )}

          {lastTranscription && (
            <Button
              onClick={playTranscription}
              disabled={isProcessing || isRecording || isPlaying}
              variant="outline"
            >
              {isPlaying ? (
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                <Volume2 className="w-6 h-6 mr-2" />
              )}
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

        <audio 
          ref={previewAudioRef}
          src={previewAudioUrl || undefined}
          onEnded={() => setIsPreviewPlaying(false)}
          className="hidden"
        />
        
        {isProcessing && (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Audio wordt verwerkt...
            </p>
          </div>
        )}

        {lastTranscription && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Bot className="w-4 h-4" />
              <p className="text-sm font-medium">{selectedVoice.name}</p>
            </div>
            <p className="text-sm">{lastTranscription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
