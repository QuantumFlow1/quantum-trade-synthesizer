
import { User } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'

type VoiceSelectorProps = {
  selectedVoiceId: string
  onVoiceChange: (voiceId: string) => void
}

export const VoiceSelector = ({ selectedVoiceId, onVoiceChange }: VoiceSelectorProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <User className="w-4 h-4" />
      <Select
        value={selectedVoiceId}
        onValueChange={onVoiceChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Kies een stem" />
        </SelectTrigger>
        <SelectContent>
          {VOICE_TEMPLATES.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.name} - {voice.description}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
