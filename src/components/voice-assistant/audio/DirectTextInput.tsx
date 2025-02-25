
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SendIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

type DirectTextInputProps = {
  onTextChange: (text: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
}

export const DirectTextInput = ({
  onTextChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type your message...'
}: DirectTextInputProps) => {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input field when it's rendered and not disabled
    if (inputRef.current && !disabled) {
      inputRef.current.focus()
    }
  }, [disabled])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim() !== '' && !disabled) {
      onSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    setText(newText)
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
        disabled={disabled}
        className="flex-1"
        data-testid="text-input"
      />
      <Button
        onClick={onSubmit}
        disabled={text.trim() === '' || disabled}
        variant="default"
        size="icon"
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
