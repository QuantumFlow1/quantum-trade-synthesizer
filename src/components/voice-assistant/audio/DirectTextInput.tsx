
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

type DirectTextInputProps = {
  directText: string
  isPlaying: boolean
  onTextChange: (text: string) => void
  onSubmit: () => void
}

export const DirectTextInput = ({
  directText,
  isPlaying,
  onTextChange,
  onSubmit
}: DirectTextInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && directText.trim()) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <Input
          placeholder="Type your message..."
          value={directText}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full"
        />
      </div>
      <Button 
        onClick={onSubmit}
        disabled={!directText.trim() || isPlaying}
        size="icon"
        className="shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
