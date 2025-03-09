
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ApiKeySettings, ModelInfo } from './types/GrokSettings';
import { 
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ApiKeyDialogContent } from './api-keys/ApiKeyDialogContent';
import { ApiKeyWarning } from './api-keys/ApiKeyWarning';
import { 
  hasCurrentModelKey, 
  loadApiKeysFromStorage, 
  saveApiKeys 
} from './api-keys/apiKeyUtils';

interface ApiKeyManagerProps {
  selectedModel: ModelInfo | undefined;
  apiKeys: ApiKeySettings;
  onApiKeysChange: (apiKeys: ApiKeySettings) => void;
}

export function ApiKeyManager({ selectedModel, apiKeys, onApiKeysChange }: ApiKeyManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Load API keys from localStorage on component mount
  useEffect(() => {
    const updatedKeys = loadApiKeysFromStorage();
    
    console.log('Loading API keys from localStorage:', {
      openai: updatedKeys.openaiApiKey ? 'present' : 'not found',
      claude: updatedKeys.claudeApiKey ? 'present' : 'not found',
      gemini: updatedKeys.geminiApiKey ? 'present' : 'not found',
      deepseek: updatedKeys.deepseekApiKey ? 'present' : 'not found',
      groq: updatedKeys.groqApiKey ? 'present' : 'not found'
    });
    
    // Update the parent component's state with loaded keys
    onApiKeysChange(updatedKeys);
  }, [onApiKeysChange]);

  const handleSave = (openaiKey: string, claudeKey: string, geminiKey: string, deepseekKey: string, groqKey: string) => {
    const updatedKeys = saveApiKeys(openaiKey, claudeKey, geminiKey, deepseekKey, groqKey);
    onApiKeysChange(updatedKeys);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Check if the current model needs an API key
  const currentModelNeedsKey = selectedModel?.needsApiKey || false;
  
  // Check if the current model has an API key set
  const hasModelKey = hasCurrentModelKey(selectedModel, apiKeys);

  return (
    <div>
      <ApiKeyWarning 
        selectedModel={selectedModel} 
        hasApiKey={hasModelKey} 
      />
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 text-xs"
          >
            <Key className="h-3.5 w-3.5 mr-1" />
            API Sleutels
          </Button>
        </DialogTrigger>
        
        <ApiKeyDialogContent 
          apiKeys={apiKeys}
          onSave={handleSave}
        />
      </Dialog>
    </div>
  );
}
