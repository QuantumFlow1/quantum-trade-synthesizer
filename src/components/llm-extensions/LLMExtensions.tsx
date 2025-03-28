
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Bot } from 'lucide-react';
import { LLMTabsList } from './components/LLMTabsList';
import { LLMTabContent } from './components/LLMTabContent';
import { useLLMExtensions } from './hooks/useLLMExtensions';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ApiKeyDialogContent } from '@/components/chat/api-keys/ApiKeyDialogContent';

export function LLMExtensions() {
  const { 
    activeTab, 
    setActiveTab, 
    enabledLLMs, 
    connectionStatus,
    toggleLLM,
    checkConnectionStatusForLLM,
    configureApiKey,
    isApiKeyDialogOpen,
    closeApiKeyDialog,
    currentLLM
  } = useLLMExtensions();
  
  return (
    <>
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-0 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <Bot className="w-5 h-5 mr-2" /> AI Assistant Extensions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <LLMTabsList 
              enabledLLMs={enabledLLMs} 
              toggleLLM={toggleLLM}
              connectionStatus={connectionStatus}
              activeTab={activeTab}
              checkConnectionStatusForLLM={checkConnectionStatusForLLM}
            />
            
            <LLMTabContent 
              tabValue="deepseek" 
              isEnabled={enabledLLMs.deepseek} 
              toggleLLM={toggleLLM}
              connectionStatus={connectionStatus.deepseek}
              onRetryConnection={() => checkConnectionStatusForLLM('deepseek')}
              onConfigure={() => configureApiKey('deepseek')}
            />
            
            <LLMTabContent 
              tabValue="openai" 
              isEnabled={enabledLLMs.openai} 
              toggleLLM={toggleLLM}
              connectionStatus={connectionStatus.openai}
              onRetryConnection={() => checkConnectionStatusForLLM('openai')}
              onConfigure={() => configureApiKey('openai')}
            />
            
            <LLMTabContent 
              tabValue="grok" 
              isEnabled={enabledLLMs.grok} 
              toggleLLM={toggleLLM}
              connectionStatus={connectionStatus.grok}
              onRetryConnection={() => checkConnectionStatusForLLM('grok')}
              onConfigure={() => configureApiKey('grok')}
            />
            
            <LLMTabContent 
              tabValue="claude" 
              isEnabled={enabledLLMs.claude} 
              toggleLLM={toggleLLM}
              connectionStatus={connectionStatus.claude}
              onRetryConnection={() => checkConnectionStatusForLLM('claude')}
              onConfigure={() => configureApiKey('claude')}
            />
            
            <LLMTabContent 
              tabValue="ollama" 
              isEnabled={enabledLLMs.ollama} 
              toggleLLM={toggleLLM}
              connectionStatus={connectionStatus.ollama}
              onRetryConnection={() => checkConnectionStatusForLLM('ollama')}
              onConfigure={() => configureApiKey('ollama')}
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* API Key Dialog */}
      <Dialog open={isApiKeyDialogOpen} onOpenChange={closeApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          {currentLLM && (
            <ApiKeyDialogContent 
              initialTab={currentLLM as any} 
              onClose={closeApiKeyDialog} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
