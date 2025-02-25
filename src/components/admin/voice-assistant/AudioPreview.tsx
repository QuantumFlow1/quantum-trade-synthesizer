
import { Button } from '@/components/ui/button'
import { PlayCircle, StopCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

type AudioPreviewProps = {
  previewAudioUrl: string | null
  isPreviewPlaying: boolean
  onPlayPreview: () => void
  onStopPreview: () => void
  onProcessAudio: () => void
  isProcessing: boolean
  processingError?: string | null
}

export const AudioPreview = ({
  previewAudioUrl,
  isPreviewPlaying,
  onPlayPreview,
  onStopPreview,
  onProcessAudio,
  isProcessing,
  processingError
}: AudioPreviewProps) => {
  if (!previewAudioUrl) return null

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {!isPreviewPlaying ? (
          <Button
            onClick={onPlayPreview}
            variant="outline"
            disabled={isProcessing}
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
          {isProcessing ? 'Processing...' : 'Process Audio'}
        </Button>
      </div>
      
      {isProcessing && (
        <div className="w-full space-y-2 animate-fade-in">
          <div className="text-center text-sm text-muted-foreground">
            Processing audio...
          </div>
          <Progress value={75} className="h-2" />
        </div>
      )}
      
      {processingError && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
