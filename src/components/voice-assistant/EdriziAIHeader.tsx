
import { Badge } from '@/components/ui/badge'
import { VoiceSelector } from './audio/VoiceSelector'
import { CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles, Bot, PowerOff } from 'lucide-react'

type EdriziAIHeaderProps = {
  grok3Available: boolean;
  manuallyDisabled?: boolean;
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
}

export const EdriziAIHeader = ({ 
  grok3Available, 
  manuallyDisabled = false,
  selectedVoiceId, 
  onVoiceChange 
}: EdriziAIHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <CardTitle>Edrizi AI Assistant</CardTitle>
        <CardDescription>Je persoonlijke AI-assistent</CardDescription>
      </div>
      <div className="flex items-center space-x-2">
        <Badge 
          variant={manuallyDisabled ? "outline" : grok3Available ? "default" : "outline"} 
          className="flex items-center space-x-1"
        >
          {manuallyDisabled ? (
            <>
              <PowerOff className="w-3 h-3" />
              <span>Grok3 Uitgeschakeld</span>
            </>
          ) : grok3Available ? (
            <>
              <Sparkles className="w-3 h-3" />
              <span>Grok3 Actief</span>
            </>
          ) : (
            <>
              <Bot className="w-3 h-3" />
              <span>Standaard AI</span>
            </>
          )}
        </Badge>
        <VoiceSelector 
          selectedVoiceId={selectedVoiceId}
          onVoiceChange={onVoiceChange}
        />
      </div>
    </div>
  )
}
