
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  return (
    <div className="flex flex-col space-y-2">
      <Input
        placeholder="Voer tekst in om voor te lezen..."
        value={directText}
        onChange={(e) => onTextChange(e.target.value)}
      />
      <Button 
        onClick={onSubmit}
        disabled={!directText.trim() || isPlaying}
      >
        Lees Tekst Voor
      </Button>
    </div>
  )
}
