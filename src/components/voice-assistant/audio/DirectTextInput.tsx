
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SendIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

type DirectTextInputProps = {
  directText: string
  isPlaying: boolean
  isProcessing?: boolean
  onTextChange: (text: string) => void
  onSubmit: () => void
}

export const DirectTextInput = ({
  directText,
  isPlaying,
  isProcessing = false,
  onTextChange,
  onSubmit
}: DirectTextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input field when it's rendered
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && directText.trim() !== '' && !isPlaying && !isProcessing) {
      onSubmit()
    }
  }

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Input
        ref={inputRef}
        value={directText}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your question here..."
        disabled={isPlaying || isProcessing}
        className="flex-1"
      />
      <Button
        onClick={onSubmit}
        disabled={directText.trim() === '' || isPlaying || isProcessing}
        variant="default"
        size="icon"
        className={isProcessing ? "animate-pulse" : ""}
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
