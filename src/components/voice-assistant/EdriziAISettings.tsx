
import { Button } from '@/components/ui/button'
import { MessageSquare, CheckCircle } from 'lucide-react'
import { VoiceSelector } from './audio/VoiceSelector'

type EdriziAISettingsProps = {
  grok3Available: boolean;
  resetGrok3Connection: () => void;
  isProcessing: boolean;
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
  clearChatHistory: () => void;
}

export const EdriziAISettings = ({ 
  grok3Available, 
  resetGrok3Connection,
  isProcessing,
  selectedVoiceId,
  onVoiceChange,
  clearChatHistory
}: EdriziAISettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Grok3 API Status</h3>
        <div className="flex items-center mt-2 space-x-2">
          <div className={`w-3 h-3 rounded-full ${grok3Available ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p className="text-sm">
            {grok3Available 
              ? "Grok3 API is beschikbaar en actief" 
              : "Grok3 API is niet beschikbaar, standaard AI wordt gebruikt"}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={resetGrok3Connection}
          disabled={isProcessing}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Test Verbinding
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Spraakassistent</h3>
        <p className="text-sm text-muted-foreground">
          Selecteer de stem die gebruikt wordt voor de AI Assistant
        </p>
        <div className="mt-2">
          <VoiceSelector 
            selectedVoiceId={selectedVoiceId}
            onVoiceChange={onVoiceChange}
          />
        </div>
      </div>
      
      <div>
        <Button
          variant="outline"
          onClick={clearChatHistory}
          className="w-full"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Wis Chatgeschiedenis
        </Button>
      </div>
    </div>
  )
}
