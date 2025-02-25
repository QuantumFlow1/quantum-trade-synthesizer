
import { Button } from '@/components/ui/button'
import { PlayCircle, StopCircle } from 'lucide-react'

type AudioPreviewProps = {
  previewAudioUrl: string | null
  isPreviewPlaying: boolean
  onPlayPreview: () => void
  onStopPreview: () => void
  onProcessAudio: () => void
  isProcessing: boolean
}

export const AudioPreview = ({
  previewAudioUrl,
  isPreviewPlaying,
  onPlayPreview,
  onStopPreview,
  onProcessAudio,
  isProcessing
}: AudioPreviewProps) => {
  if (!previewAudioUrl) return null

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {!isPreviewPlaying ? (
        <Button
          onClick={onPlayPreview}
          variant="outline"
        >
          <PlayCircle className="w-6 h-6 mr-2" />
          Preview
        </Button>
      ) : (
        <Button
          onClick={onStopPreview}
          variant="outline"
        >
          <StopCircle className="w-6 h-6 mr-2" />
          Stop
        </Button>
      )}

      <Button
        onClick={onProcessAudio}
        disabled={isProcessing}
        variant="secondary"
      >
        Process Audio
      </Button>
    </div>
  )
}
