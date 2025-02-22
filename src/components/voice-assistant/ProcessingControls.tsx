
import { Loader2 } from 'lucide-react'
import { TranscriptionDisplay } from './TranscriptionDisplay'
import { Button } from '@/components/ui/button'

type ProcessingControlsProps = {
  isProcessing: boolean
  previewAudioUrl: string | null
  lastTranscription: string
  selectedVoiceName: string
  isPlaying: boolean
  isRecording: boolean
  onProcess: () => void
  onPlayTranscription: () => void
}

export const ProcessingControls = ({
  isProcessing,
  previewAudioUrl,
  lastTranscription,
  selectedVoiceName,
  isPlaying,
  isRecording,
  onProcess,
  onPlayTranscription
}: ProcessingControlsProps) => {
  return (
    <>
      {previewAudioUrl && (
        <Button
          onClick={onProcess}
          disabled={isProcessing}
          variant="secondary"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Verwerk Audio"
          )}
        </Button>
      )}

      <TranscriptionDisplay
        isProcessing={isProcessing}
        lastTranscription={lastTranscription}
        voiceName={selectedVoiceName}
        isPlaying={isPlaying}
        onPlay={onPlayTranscription}
        isRecording={isRecording}
      />
    </>
  )
}

