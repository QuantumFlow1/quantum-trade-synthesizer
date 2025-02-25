
import { Button } from '@/components/ui/button'
import { Mic, MicOff } from 'lucide-react'
import { DirectTextInput } from './audio/DirectTextInput'

type EdriziAIChatInputProps = {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  startRecording: () => void;
  handleStopRecording: () => void;
  lastUserInput: string;
  handleTextChange: (text: string) => void;
  handleDirectTextSubmit: () => void;
}

export const EdriziAIChatInput = ({
  isRecording,
  isProcessing,
  isPlaying,
  startRecording,
  handleStopRecording,
  lastUserInput,
  handleTextChange,
  handleDirectTextSubmit
}: EdriziAIChatInputProps) => {
  return (
    <div className="p-3 border-t">
      <div className="flex space-x-2">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={isRecording ? handleStopRecording : startRecording}
          disabled={isProcessing || isPlaying}
          className="flex-shrink-0"
        >
          {isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        
        <DirectTextInput
          directText={lastUserInput}
          onTextChange={handleTextChange}
          onSubmit={handleDirectTextSubmit}
          disabled={isRecording || isProcessing || isPlaying}
          placeholder="Typ je bericht..."
        />
      </div>
    </div>
  )
}
