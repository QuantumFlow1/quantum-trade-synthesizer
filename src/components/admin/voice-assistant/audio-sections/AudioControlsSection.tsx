
import { AudioControls } from '@/components/voice-assistant/audio/AudioControls'

type AudioControlsSectionProps = {
  isRecording: boolean
  isProcessing: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onTriggerFileUpload: () => void
}

export const AudioControlsSection = ({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
  onTriggerFileUpload
}: AudioControlsSectionProps) => {
  return (
    <AudioControls
      isRecording={isRecording}
      isProcessing={isProcessing}
      previewAudioUrl={null} // Not needed for this section
      isPreviewPlaying={false} // Not needed for this section
      onStartRecording={onStartRecording}
      onStopRecording={onStopRecording}
      onTriggerFileUpload={onTriggerFileUpload}
      onPlayPreview={() => {}} // Not needed for this section
      onStopPreview={() => {}} // Not needed for this section
      onProcessAudio={() => {}} // Not needed for this section
    />
  )
}
