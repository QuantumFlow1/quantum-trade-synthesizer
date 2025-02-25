
import { useRef } from 'react'
import { Input } from '@/components/ui/input'
import { DirectTextInput } from '@/components/voice-assistant/audio/DirectTextInput'
import { AudioControls } from '@/components/voice-assistant/audio/AudioControls'
import { AudioPreview } from './AudioPreview'
import { VoiceTemplate } from '@/lib/types'
import { Alert, AlertDescription } from '@/components/ui/alert'

type AudioSectionProps = {
  isRecording: boolean
  isProcessing: boolean
  isPlaying: boolean
  directText: string
  previewAudioUrl: string | null
  isPreviewPlaying: boolean
  previewAudioRef: React.RefObject<HTMLAudioElement>
  selectedVoice: VoiceTemplate
  processingError: string | null
  setDirectText: (text: string) => void
  startRecording: () => void
  handleStopRecording: () => void
  playPreview: () => void
  stopPreview: () => void
  processAudio: (url: string) => void
  handleDirectTextSubmit: () => void
  setIsPreviewPlaying: (isPlaying: boolean) => void
}

export const AudioSection = ({
  isRecording,
  isProcessing,
  isPlaying,
  directText,
  previewAudioUrl,
  isPreviewPlaying,
  previewAudioRef,
  selectedVoice,
  processingError,
  setDirectText,
  startRecording,
  handleStopRecording,
  playPreview,
  stopPreview,
  processAudio,
  handleDirectTextSubmit,
  setIsPreviewPlaying
}: AudioSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      return
    }

    const audioUrl = URL.createObjectURL(file)
    // Set the audio URL in the parent component
    if (processAudio) {
      setTimeout(() => processAudio(audioUrl), 200)
    }
  }

  return (
    <>
      <DirectTextInput
        directText={directText}
        isPlaying={isPlaying}
        onTextChange={setDirectText}
        onSubmit={handleDirectTextSubmit}
        isProcessing={isProcessing}
      />

      <div className="relative">
        <div className="absolute inset-0 w-full h-0.5 bg-border -top-2" />
      </div>

      {processingError && (
        <Alert variant="destructive" className="mt-4 mb-2 animate-fade-in">
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}

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
        onProcessAudio={() => previewAudioUrl && processAudio(previewAudioUrl)}
      />
      
      <AudioPreview 
        previewAudioUrl={previewAudioUrl}
        isPreviewPlaying={isPreviewPlaying}
        onPlayPreview={playPreview}
        onStopPreview={stopPreview}
        onProcessAudio={() => previewAudioUrl && processAudio(previewAudioUrl)}
        isProcessing={isProcessing}
        processingError={processingError}
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
    </>
  )
}
