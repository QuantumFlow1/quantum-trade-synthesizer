
import { Button } from '@/components/ui/button'
import { MessageSquare, CheckCircle, Power } from 'lucide-react'
import { VoiceSelector } from './audio/VoiceSelector'
import { Switch } from '@/components/ui/switch'

type EdriziAISettingsProps = {
  grok3Available: boolean;
  manuallyDisabled?: boolean;
  resetGrok3Connection: () => void;
  disableGrok3Connection?: () => void;
  isProcessing: boolean;
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
  clearChatHistory: () => void;
}

export const EdriziAISettings = ({ 
  grok3Available, 
  manuallyDisabled = false,
  resetGrok3Connection,
  disableGrok3Connection,
  isProcessing,
  selectedVoiceId,
  onVoiceChange,
  clearChatHistory
}: EdriziAISettingsProps) => {
  
  const handleConnectionToggle = (enabled: boolean) => {
    if (!enabled && disableGrok3Connection) {
      disableGrok3Connection()
    } else if (enabled) {
      resetGrok3Connection()
    }
  }
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Grok3 AI Status</h3>
        
        {disableGrok3Connection && (
          <div className="flex items-center justify-between my-3 p-3 border rounded-md">
            <div>
              <p className="font-medium">Grok3 AI Connectie</p>
              <p className="text-sm text-muted-foreground">
                Zet uit om terug te vallen op standaard AI
              </p>
            </div>
            <Switch
              checked={!manuallyDisabled}
              onCheckedChange={handleConnectionToggle}
              disabled={isProcessing}
            />
          </div>
        )}
        
        <div className="flex items-center mt-2 space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            manuallyDisabled 
              ? 'bg-orange-500' 
              : grok3Available 
                ? 'bg-green-500' 
                : 'bg-red-500'
          }`}></div>
          <p className="text-sm">
            {manuallyDisabled 
              ? "Grok3 API is handmatig uitgeschakeld" 
              : grok3Available 
                ? "Grok3 API is beschikbaar en actief" 
                : "Grok3 API is niet beschikbaar, standaard AI wordt gebruikt"}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={resetGrok3Connection}
          disabled={isProcessing || manuallyDisabled}
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
