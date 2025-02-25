
import { DirectTextInput } from '@/components/voice-assistant/audio/DirectTextInput'

type DirectTextInputSectionProps = {
  directText: string
  isPlaying: boolean
  isProcessing: boolean
  onTextChange: (text: string) => void
  onSubmit: () => void
}

export const DirectTextInputSection = ({
  directText,
  isPlaying,
  isProcessing,
  onTextChange,
  onSubmit
}: DirectTextInputSectionProps) => {
  return (
    <DirectTextInput
      onTextChange={onTextChange}
      onSubmit={onSubmit}
      disabled={isPlaying || isProcessing}
      placeholder="Type your question here..."
    />
  )
}
