
import { Button } from '@/components/ui/button'
import { Mic, Square, Upload, Loader2 } from 'lucide-react'

type AudioControlsProps = {
  isRecording: boolean
  isProcessing: boolean
  previewAudioUrl: string | null
  isPreviewPlaying: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onTriggerFileUpload: () => void
  onPlayPreview: () => void
  onStopPreview: () => void
  onProcessAudio: () => void
}

export const AudioControls = ({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
  onTriggerFileUpload,
}: AudioControlsProps) => {
  return (
    <div className="flex justify-center space-x-4">
      {!isRecording ? (
        <Button
          onClick={onStartRecording}
          disabled={isProcessing}
          className={`bg-blue-500 hover:bg-blue-600 ${isProcessing ? 'opacity-50' : ''}`}
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          ) : (
            <Mic className="w-6 h-6 mr-2" />
          )}
          {isProcessing ? "Processing..." : "Start Opname"}
        </Button>
      ) : (
        <Button
          onClick={onStopRecording}
          variant="destructive"
          className="animate-pulse"
        >
          <Square className="w-6 h-6 mr-2" />
          Stop Opname
        </Button>
      )}
      
      <Button
        onClick={onTriggerFileUpload}
        disabled={isProcessing || isRecording}
        variant="outline"
        className={isProcessing ? 'opacity-50' : ''}
      >
        <Upload className="w-6 h-6 mr-2" />
        Upload Audio
      </Button>
    </div>
  )
}
