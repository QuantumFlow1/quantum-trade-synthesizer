
import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/components/auth/AuthProvider'
import { VoiceSelector } from '../../voice-assistant/audio/VoiceSelector'
import { AudioControls } from '../../voice-assistant/audio/AudioControls'
import { TranscriptionDisplay } from '../../voice-assistant/audio/TranscriptionDisplay'
import { DirectTextInput } from '../../voice-assistant/audio/DirectTextInput'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioProcessing } from '@/hooks/use-audio-processing'
import { useVoiceGreeting } from '@/hooks/use-voice-greeting'
import { SuperAdminGreeting } from './SuperAdminGreeting'
import { useAudioFileUpload } from '@/hooks/use-audio-file-upload'
import { useStopRecording } from '@/hooks/use-stop-recording'
import { useVoiceSelection } from '@/hooks/use-voice-selection'
import { useDirectTextInput } from '@/hooks/use-direct-text-input'

export const SuperAdminVoiceContainer = () => {
  const { userProfile } = useAuth()
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio } = useAudioPlayback()
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [lastUserInput, setLastUserInput] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Early return if not super admin
  if (userProfile?.role !== 'super_admin') {
    return null
  }

  // Use the voice selection hook
  const { selectedVoice, handleVoiceChange } = useVoiceSelection()

  // Use the audio preview hook
  const {
    previewAudioUrl,
    setPreviewAudioUrl,
    isPreviewPlaying,
    setIsPreviewPlaying,
    previewAudioRef,
    playPreview,
    stopPreview
  } = useAudioPreview()

  // Use the audio processing hook
  const { isProcessing, processAudio } = useAudioProcessing(
    selectedVoice,
    previewAudioUrl,
    setLastTranscription
  )

  // Initialize with voice greeting
  useVoiceGreeting(selectedVoice, isPlaying)

  // Use the stop recording hook
  const { handleStopRecording, isStoppingRecording } = useStopRecording({
    stopRecording,
    setPreviewAudioUrl,
    processAudio,
    selectedVoice,
    setLastUserInput
  })

  // Use the file upload hook
  const { handleFileUpload } = useAudioFileUpload({
    setPreviewAudioUrl,
    processAudio
  })

  // Use the direct text input hook
  const { directText, setDirectText, handleDirectTextSubmit } = useDirectTextInput({
    playAudio,
    selectedVoiceId: selectedVoice.id,
    selectedVoiceName: selectedVoice.name,
    setLastUserInput
  })

  const playTranscription = () => {
    if (lastTranscription) {
      console.log(`Playing transcription: ${lastTranscription.substring(0, 50)}...`)
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
          lastUserInput={lastUserInput}
        />
      </CardContent>
    </Card>
  )
}
