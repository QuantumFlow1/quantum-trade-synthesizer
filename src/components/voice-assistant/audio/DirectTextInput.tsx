
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SendIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

type DirectTextInputProps = {
  onTextChange: (text: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
  // Allow old props to be passed for backward compatibility
  directText?: string
  isPlaying?: boolean
  isProcessing?: boolean
}

export const DirectTextInput = ({
  onTextChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type your message...',
  directText: externalText,
  isPlaying,
  isProcessing
}: DirectTextInputProps) => {
  // Determine if we should be disabled based on either the disabled prop or the legacy props
  const isDisabled = disabled || isPlaying || isProcessing || false
  
  // Use either external state or internal state
  const [internalText, setInternalText] = useState('')
  const text = externalText !== undefined ? externalText : internalText
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input field when it's rendered and not disabled
    if (inputRef.current && !isDisabled) {
      inputRef.current.focus()
    }
  }, [isDisabled])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim() !== '' && !isDisabled) {
      onSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    if (externalText === undefined) {
      // Only update internal state if we're not using external state
      setInternalText(newText)
    }
    onTextChange(newText)
  }

  return (
    <div className="flex items-center space-x-2 w-full">
      <Input
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        className="flex-1"
        data-testid="text-input"
      />
      <Button
        onClick={onSubmit}
        disabled={text.trim() === '' || isDisabled}
        variant="default"
        size="icon"
        className={isProcessing ? "animate-pulse" : ""}
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
