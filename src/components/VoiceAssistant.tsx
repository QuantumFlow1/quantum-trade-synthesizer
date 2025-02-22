
import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { VoiceSelector } from './voice-assistant/VoiceSelector'
import { AudioControls } from './voice-assistant/AudioControls'
import { DirectTextInput } from './voice-assistant/DirectTextInput'
import { ProcessingControls } from './voice-assistant/ProcessingControls'
import { PreviewPlayer } from './voice-assistant/PreviewPlayer'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { VoiceTemplate } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export const VoiceAssistant = () => {
  const { toast } = useToast()
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio } = useAudioPlayback()
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [directText, setDirectText] = useState<string>('')
  const [selectedVoice, setSelectedVoice] = useState<VoiceTemplate>(VOICE_TEMPLATES[0])
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleStopRecording = async () => {
    const audioUrl = await stopRecording()
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
    setIsPreviewPlaying(true)
  }

  const stopPreview = () => {
    setIsPreviewPlaying(false)
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

  const handleVoiceChange = (voiceId: string) => {
    const voice = VOICE_TEMPLATES.find(v => v.id === voiceId)
    if (voice) setSelectedVoice(voice)
  }

  const handleDirectTextSubmit = () => {
    if (directText.trim()) {
      playAudio(directText, selectedVoice.id, selectedVoice.name)
    }
  }

  const playTranscription = () => {
    if (lastTranscription) {
      playAudio(lastTranscription, selectedVoice.id, selectedVoice.name)
    }
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

        <DirectTextInput
          directText={directText}
          isPlaying={isPlaying}
          onTextChange={setDirectText}
          onSubmit={handleDirectTextSubmit}
        />

        <div className="relative">
          <div className="absolute inset-0 w-full h-0.5 bg-border -top-2" />
        </div>

        <AudioControls
          isRecording={isRecording}
          isProcessing={isProcessing}
          previewAudioUrl={previewAudioUrl}
          isPreviewPlaying={isPreviewPlaying}
          onStartRecording={startRecording}
          onStopRecording={handleStopRecording}
          onTriggerFileUpload={() => fileInputRef.current?.click()}
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

        <PreviewPlayer
          audioUrl={previewAudioUrl}
          onEnded={() => setIsPreviewPlaying(false)}
        />
        
        <ProcessingControls
          isProcessing={isProcessing}
          previewAudioUrl={previewAudioUrl}
          lastTranscription={lastTranscription}
          selectedVoiceName={selectedVoice.name}
          isPlaying={isPlaying}
          isRecording={isRecording}
          onProcess={processAudio}
          onPlayTranscription={playTranscription}
        />
      </CardContent>
    </Card>
  )
}

