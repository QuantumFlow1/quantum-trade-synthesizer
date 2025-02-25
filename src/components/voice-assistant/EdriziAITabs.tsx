
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle } from 'lucide-react'
import { EdriziAIChatHistory } from './EdriziAIChatHistory'
import { EdriziAIProcessingIndicator } from './EdriziAIProcessingIndicator'
import { EdriziAISettings } from './EdriziAISettings'
import { useRef } from 'react'

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type EdriziAITabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chatHistory: ChatMessage[];
  isProcessing: boolean;
  processingError: string | null;
  processingStage?: string;
  grok3Available: boolean;
  manuallyDisabled?: boolean;
  resetGrok3Connection: () => void;
  disableGrok3Connection?: () => void;
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const EdriziAITabs = ({
  activeTab,
  setActiveTab,
  chatHistory,
  isProcessing,
  processingError,
  processingStage,
  grok3Available,
  manuallyDisabled,
  resetGrok3Connection,
  disableGrok3Connection,
  selectedVoiceId,
  onVoiceChange,
  setChatHistory
}: EdriziAITabsProps) => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const clearChatHistory = () => {
    setChatHistory([])
  }

  return (
    <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center px-3">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="settings">Instellingen</TabsTrigger>
        </TabsList>
        
        {activeTab === 'chat' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => resetGrok3Connection()}
            disabled={isProcessing || manuallyDisabled}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Test Verbinding
          </Button>
        )}
      </div>
      
      <TabsContent value="chat" className="m-0 p-0">
        <div 
          ref={chatContainerRef}
          className="relative rounded-md h-[400px] mb-2 p-3"
        >
          <EdriziAIChatHistory chatHistory={chatHistory} />
          
          <EdriziAIProcessingIndicator
            isProcessing={isProcessing}
            processingError={processingError}
            processingStage={processingStage}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="settings" className="p-3">
        <EdriziAISettings
          grok3Available={grok3Available}
          manuallyDisabled={manuallyDisabled}
          resetGrok3Connection={resetGrok3Connection}
          disableGrok3Connection={disableGrok3Connection}
          isProcessing={isProcessing}
          selectedVoiceId={selectedVoiceId}
          onVoiceChange={onVoiceChange}
          clearChatHistory={clearChatHistory}
        />
      </TabsContent>
    </Tabs>
  )
}
