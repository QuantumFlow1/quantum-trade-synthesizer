
import { useRef } from 'react'
import { VoiceTemplate } from '@/lib/types'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DirectTextInputSection } from './audio-sections/DirectTextInputSection'
import { AudioControlsSection } from './audio-sections/AudioControlsSection'
import { AudioPreviewSection } from './audio-sections/AudioPreviewSection'
import { FileUploadSection } from './audio-sections/FileUploadSection'

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
    processAudio(audioUrl)
  }

  const handleTriggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <>
      <DirectTextInputSection
        directText={directText}
        isPlaying={isPlaying}
        isProcessing={isProcessing}
        onTextChange={setDirectText}
        onSubmit={handleDirectTextSubmit}
      />

      <div className="relative">
        <div className="absolute inset-0 w-full h-0.5 bg-border -top-2" />
      </div>

      {processingError && (
        <Alert variant="destructive" className="mt-4 mb-2 animate-fade-in">
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}

      <AudioControlsSection
        isRecording={isRecording}
        isProcessing={isProcessing}
        onStartRecording={startRecording}
        onStopRecording={handleStopRecording}
        onTriggerFileUpload={handleTriggerFileUpload}
      />
      
      <AudioPreviewSection 
        previewAudioUrl={previewAudioUrl}
        isPreviewPlaying={isPreviewPlaying}
        isProcessing={isProcessing}
        processingError={processingError}
        onPlayPreview={playPreview}
        onStopPreview={stopPreview}
        onProcessAudio={() => previewAudioUrl && processAudio(previewAudioUrl)}
      />
      
      <FileUploadSection
        fileInputRef={fileInputRef}
        onFileUpload={handleFileUpload}
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
