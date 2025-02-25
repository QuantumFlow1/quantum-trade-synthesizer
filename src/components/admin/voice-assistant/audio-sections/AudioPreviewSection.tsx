
import { AudioPreview } from '@/components/admin/voice-assistant/AudioPreview'

type AudioPreviewSectionProps = {
  previewAudioUrl: string | null
  isPreviewPlaying: boolean
  isProcessing: boolean
  processingError: string | null
  onPlayPreview: () => void
  onStopPreview: () => void
  onProcessAudio: () => void
}

export const AudioPreviewSection = ({
  previewAudioUrl,
  isPreviewPlaying,
  isProcessing,
  processingError,
  onPlayPreview,
  onStopPreview,
  onProcessAudio
}: AudioPreviewSectionProps) => {
  if (!previewAudioUrl) return null
  
  return (
    <AudioPreview
      previewAudioUrl={previewAudioUrl}
      isPreviewPlaying={isPreviewPlaying}
      onPlayPreview={onPlayPreview}
      onStopPreview={onStopPreview}
      onProcessAudio={onProcessAudio}
      isProcessing={isProcessing}
      processingError={processingError}
    />
  )
}
