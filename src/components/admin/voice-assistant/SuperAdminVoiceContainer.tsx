
import { useState, useRef } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioProcessing } from '@/hooks/use-audio-processing'
import { useVoiceGreeting } from '@/hooks/use-voice-greeting'
import { useStopRecording } from '@/hooks/use-stop-recording'
import { useVoiceSelection } from '@/hooks/use-voice-selection'
import { useDirectTextInput } from '@/hooks/use-direct-text-input'
import { useAudioFileUpload } from '@/hooks/use-audio-file-upload'
import { VoiceAssistantLayout } from './VoiceAssistantLayout'

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
    <VoiceAssistantLayout
      title="EdriziAI Super Admin Assistant"
      selectedVoiceId={selectedVoice.id}
      onVoiceChange={handleVoiceChange}
      directText={directText}
      isPlaying={isPlaying}
      onDirectTextChange={setDirectText}
      onDirectTextSubmit={handleDirectTextSubmit}
      isRecording={isRecording}
      isProcessing={isProcessing}
      previewAudioUrl={previewAudioUrl}
      isPreviewPlaying={isPreviewPlaying}
      onStartRecording={startRecording}
      onStopRecording={handleStopRecording}
      onPlayPreview={playPreview}
      onStopPreview={stopPreview}
      onProcessAudio={processAudio}
      lastTranscription={lastTranscription}
      voiceName={selectedVoice.name}
      onPlayTranscription={playTranscription}
      lastUserInput={lastUserInput}
      previewAudioRef={previewAudioRef}
      fileInputRef={fileInputRef}
      onFileUpload={handleFileUpload}
    />
  )
}
