import { Card, CardContent } from '@/components/ui/card'
import { GrokChatHeader } from './GrokChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { useGrokChat } from './useGrokChat'
import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GrokChatSettings } from './GrokChatSettings'
import { AI_MODELS } from './types/GrokSettings'
import { useNavigate } from 'react-router-dom'
import AdvancedLLMInterface from './AdvancedLLMInterface'

export function GrokChat() {
  const navigate = useNavigate();
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    clearChat,
    apiAvailable,
    retryApiConnection,
    grokSettings,
    setGrokSettings
  } = useGrokChat();

  // Use the advanced interface instead of the standard chat interface
  const [useAdvancedInterface, setUseAdvancedInterface] = useState(true);
  
  // Instellingen standaard zichtbaar maken
  const [showSettings, setShowSettings] = useState(false);
  
  // Haal de volledige naam van het geselecteerde model op
  const selectedModel = AI_MODELS.find(m => m.id === grokSettings.selectedModel);
  const selectedModelName = selectedModel?.name || 'AI';

  // Display an info message when component mounts
  useEffect(() => {
    toast({
      title: "Multi-Model AI Interface",
      description: `Chat met verschillende AI modellen. Standaard model is ${selectedModelName}.`,
      duration: 5000,
    });
  }, [selectedModelName]);

  const handleRetryConnection = async () => {
    await retryApiConnection();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const toggleInterface = () => {
    setUseAdvancedInterface(!useAdvancedInterface);
    toast({
      title: `${useAdvancedInterface ? 'Standaard' : 'Geavanceerde'} interface geactiveerd`,
      description: `Je gebruikt nu de ${useAdvancedInterface ? 'standaard' : 'geavanceerde'} AI interface.`,
      duration: 3000,
    });
  };
  
  const handleExit = () => {
    // Navigeer terug naar de hoofdpagina
    navigate('/');
    
    // Toon een bevestigingsmelding
    toast({
      title: "Chat verlaten",
      description: "Je hebt de chat verlaten.",
      duration: 3000,
    });
  };

  // Render the advanced interface if enabled
  if (useAdvancedInterface) {
    return <AdvancedLLMInterface />;
  }

  // Otherwise render the standard chat interface
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white">
      <GrokChatHeader 
        onClearChat={clearChat} 
        onToggleSettings={toggleSettings}
        onExit={handleExit}
        modelName={selectedModelName}
        onToggleInterface={toggleInterface}
      />
      
      <CardContent className="p-0 flex flex-col h-[600px]">
        {/* API Status Alert */}
        {apiAvailable === false && grokSettings.selectedModel === 'grok3' && (
          <Alert variant="warning" className="m-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>AI Service Status</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>De {selectedModelName} service is momenteel niet beschikbaar. Dit is een probleem aan de kant van de AI provider zelf, niet met uw systeem of verbinding. We hebben automatisch overgeschakeld naar een reserve AI-service om u zonder onderbreking te blijven helpen.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-end hover:bg-yellow-100" 
                onClick={handleRetryConnection}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verbinding controleren...
                  </>
                ) : (
                  'Probeer opnieuw te verbinden'
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Settings Panel - toon alleen als showSettings true is */}
        {showSettings && (
          <div className="mx-4 mt-4">
            <GrokChatSettings 
              settings={grokSettings}
              onSettingsChange={setGrokSettings}
            />
          </div>
        )}
        
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50 pt-3">
          <ChatMessages messages={messages} />
        </div>
        
        {/* Chat Input */}
        <ChatInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
