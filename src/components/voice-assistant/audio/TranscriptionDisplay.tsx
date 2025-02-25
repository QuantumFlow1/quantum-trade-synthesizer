
import { Bot, Loader2, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type TranscriptionDisplayProps = {
  isProcessing: boolean
  lastTranscription: string
  voiceName: string
  isPlaying: boolean
  onPlay: () => void
  isRecording: boolean
}

export const TranscriptionDisplay = ({
  isProcessing,
  lastTranscription,
  voiceName,
  isPlaying,
  onPlay,
  isRecording
}: TranscriptionDisplayProps) => {
  return (
    <>
      {isProcessing && (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Audio wordt verwerkt...
          </p>
        </div>
      )}

      {lastTranscription && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <p className="text-sm font-medium">{voiceName}</p>
            </div>
            <Button
              onClick={onPlay}
              disabled={isProcessing || isRecording || isPlaying}
              variant="outline"
              size="sm"
            >
              {isPlaying ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4 mr-2" />
              )}
              Afspelen
            </Button>
          </div>
          <p className="text-sm">{lastTranscription}</p>
        </div>
      )}
    </>
  )
}
