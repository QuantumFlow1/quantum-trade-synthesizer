
import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { VoiceSelector } from './voice-assistant/VoiceSelector'
import { AudioControls } from './voice-assistant/AudioControls'
import { TranscriptionDisplay } from './voice-assistant/TranscriptionDisplay'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { VoiceTemplate } from '@/lib/types'

export const VoiceAssistant = () => {
  const { toast } = useToast()
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<VoiceTemplate>(VOICE_TEMPLATES[0])
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

  const handleStopRecording = () => {
    const audioUrl = stopRecording()
    if (audioUrl) {
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

  const handleVoiceChange = (voiceId: string) => {
    const voice = VOICE_TEMPLATES.find(v => v.id === voiceId)
    if (voice) setSelectedVoice(voice)
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
        <VoiceSelector 
          selectedVoiceId={selectedVoice.id}
          onVoiceChange={handleVoiceChange}
        />

        <AudioControls
          isRecording={isRecording}
          isProcessing={isProcessing}
          previewAudioUrl={previewAudioUrl}
          isPreviewPlaying={isPreviewPlaying}
          onStartRecording={startRecording}
          onStopRecording={handleStopRecording}
          onTriggerFileUpload={triggerFileUpload}
          onPlayPreview={playPreview}
          onStopPreview={stopPreview}
          onProcessAudio={processAudio}
        />
        
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
        
        <TranscriptionDisplay
          isProcessing={isProcessing}
          lastTranscription={lastTranscription}
          voiceName={selectedVoice.name}
          isPlaying={isPlaying}
          onPlay={playTranscription}
          isRecording={isRecording}
        />
      </CardContent>
    </Card>
  )
}
