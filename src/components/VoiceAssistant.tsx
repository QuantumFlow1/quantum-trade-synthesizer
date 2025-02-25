
import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useVoiceGreeting } from '@/hooks/use-voice-greeting'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioProcessing } from '@/hooks/use-audio-processing'
import { VoiceSelector } from './voice-assistant/audio/VoiceSelector'
import { AudioControls } from './voice-assistant/audio/AudioControls'
import { TranscriptionDisplay } from './voice-assistant/audio/TranscriptionDisplay'
import { DirectTextInput } from './voice-assistant/audio/DirectTextInput'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

export const VoiceAssistant = () => {
  const { toast } = useToast()
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio } = useAudioPlayback()
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [lastUserInput, setLastUserInput] = useState<string>('')
  const [directText, setDirectText] = useState<string>('')
  const [selectedVoice, setSelectedVoice] = useState(VOICE_TEMPLATES[0])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    previewAudioUrl,
    setPreviewAudioUrl,
    isPreviewPlaying,
    setIsPreviewPlaying,
    previewAudioRef,
    playPreview,
    stopPreview
  } = useAudioPreview()

  const { isProcessing, processAudio } = useAudioProcessing(
    selectedVoice,
    previewAudioUrl,
    setLastTranscription
  )

  useVoiceGreeting(selectedVoice, isPlaying)

  const handleStopRecording = async () => {
    const audioUrl = await stopRecording()
    if (audioUrl) {
      setPreviewAudioUrl(audioUrl)
      
      // Get the user's speech transcription first
      const response = await fetch(audioUrl)
      const blob = await response.blob()
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split('base64,')[1]
        
        // Get transcription 
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('process-voice', {
          body: { 
            audioData: base64Data,
            voiceTemplate: selectedVoice.prompt
          }
        })
        
        if (!transcriptionError && transcriptionData?.transcription) {
          setLastUserInput(transcriptionData.transcription)
        }
        
        // Then process with AI
        processAudio()
      }
      
      reader.readAsDataURL(blob)
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
    // Process the uploaded audio
    setTimeout(() => processAudio(), 200)
  }

  const handleVoiceChange = (voiceId: string) => {
    const voice = VOICE_TEMPLATES.find(v => v.id === voiceId)
    if (voice) setSelectedVoice(voice)
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleDirectTextSubmit = () => {
    if (directText.trim()) {
      setLastUserInput(directText)
      playAudio(directText, selectedVoice.id, selectedVoice.name)
      setDirectText('') // Clear after submission
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
          lastUserInput={lastUserInput}
        />
      </CardContent>
    </Card>
  )
}
