
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

type DirectTextInputProps = {
  directText: string
  onTextChange: (text: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
  isPlaying?: boolean
}

export const DirectTextInput = ({
  directText,
  onTextChange,
  onSubmit,
  disabled = false,
  placeholder = 'Typ je bericht...',
  isPlaying
}: DirectTextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle Enter key press to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled && directText.trim()) {
      e.preventDefault()
      onSubmit()
    }
  }

  // Focus the input when it becomes enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [disabled])
  
  return (
    <div className="flex w-full gap-2">
      <Input
        ref={inputRef}
        type="text"
        value={directText}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isPlaying}
        className="flex-1"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !directText.trim() || isPlaying}
        onClick={onSubmit}
        className={`transition-all ${directText.trim() ? 'opacity-100' : 'opacity-50'}`}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
