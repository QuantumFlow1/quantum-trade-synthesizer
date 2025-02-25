
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/components/auth/AuthProvider'
import { VoiceSelector } from '../voice-assistant/audio/VoiceSelector'
import { AudioControls } from '../voice-assistant/audio/AudioControls'
import { TranscriptionDisplay } from '../voice-assistant/audio/TranscriptionDisplay'
import { DirectTextInput } from '../voice-assistant/audio/DirectTextInput'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioProcessing } from '@/hooks/use-audio-processing'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'

export const SuperAdminVoiceAssistant = () => {
  const { userProfile } = useAuth()
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio } = useAudioPlayback()
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [directText, setDirectText] = useState<string>('')
  const [selectedVoice, setSelectedVoice] = useState(VOICE_TEMPLATES[0])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // If not super admin, don't render
  if (userProfile?.role !== 'super_admin') {
    return null
  }

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
    setLastTranscription,
    'EdriziAI-info' // Set the agent ID to use the specific configuration
  )

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
        title: "Error",
        description: "Only audio files are allowed",
        variant: "destructive",
      })
      return
    }

    const audioUrl = URL.createObjectURL(file)
    setPreviewAudioUrl(audioUrl)
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
        <CardTitle className="text-center">EdriziAI Super Admin Assistant</CardTitle>
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
        
        <input
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
