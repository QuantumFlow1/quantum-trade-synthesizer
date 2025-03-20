
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
  adminPanelPath?: string;
}

export function ApiKeyManager({ 
  selectedModel, 
  apiKeys, 
  onApiKeysChange,
  adminPanelPath = '/admin/api-keys'
}: ApiKeyManagerProps) {
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

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Redirect to admin panel instead of opening dialog
      window.location.href = adminPanelPath;
    }
    setIsOpen(false);
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
        adminPanelPath={adminPanelPath}
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-4 text-xs"
        onClick={() => window.location.href = adminPanelPath}
      >
        <Key className="h-3.5 w-3.5 mr-1" />
        API Sleutels Beheren
      </Button>
    </div>
  );
}
