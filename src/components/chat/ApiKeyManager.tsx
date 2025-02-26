
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ApiKeySettings, ModelInfo } from './types/GrokSettings';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key, Save, Check } from 'lucide-react';

interface ApiKeyManagerProps {
  selectedModel: ModelInfo | undefined;
  apiKeys: ApiKeySettings;
  onApiKeysChange: (apiKeys: ApiKeySettings) => void;
}

export function ApiKeyManager({ selectedModel, apiKeys, onApiKeysChange }: ApiKeyManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openaiApiKey || '');
  const [claudeKey, setClaudeKey] = useState(apiKeys.claudeApiKey || '');
  const [geminiKey, setGeminiKey] = useState(apiKeys.geminiApiKey || '');
  const [deepseekKey, setDeepseekKey] = useState(apiKeys.deepseekApiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updatedKeys: ApiKeySettings = {
      openaiApiKey: openaiKey,
      claudeApiKey: claudeKey,
      geminiApiKey: geminiKey,
      deepseekApiKey: deepseekKey
    };
    
    onApiKeysChange(updatedKeys);
    setSaved(true);
    
    // Reset saved status after 2 seconds
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form values if dialog is closed without saving
      setOpenaiKey(apiKeys.openaiApiKey || '');
      setClaudeKey(apiKeys.claudeApiKey || '');
      setGeminiKey(apiKeys.geminiApiKey || '');
      setDeepseekKey(apiKeys.deepseekApiKey || '');
    }
  };

  // Check if the current model needs an API key
  const currentModelNeedsKey = selectedModel?.needsApiKey || false;
  
  // Check if the current model has an API key set
  const hasCurrentModelKey = () => {
    if (!selectedModel) return false;
    
    switch (selectedModel.id) {
      case 'openai':
      case 'gpt-4':
      case 'gpt-3.5-turbo':
        return !!apiKeys.openaiApiKey;
      case 'claude':
      case 'claude-3-haiku':
      case 'claude-3-sonnet':
      case 'claude-3-opus':
        return !!apiKeys.claudeApiKey;
      case 'gemini':
      case 'gemini-pro':
        return !!apiKeys.geminiApiKey;
      case 'deepseek':
      case 'deepseek-chat':
        return !!apiKeys.deepseekApiKey;
      default:
        return true;
    }
  };

  return (
    <div>
      {currentModelNeedsKey && !hasCurrentModelKey() && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
          <p className="flex items-center">
            <Key className="h-4 w-4 mr-2" />
            Dit model heeft een API-sleutel nodig om te functioneren. Klik op 'API Sleutels' om deze in te stellen.
          </p>
        </div>
      )}
      
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>API Sleutels Beheren</DialogTitle>
            <DialogDescription>
              Voer uw API sleutels in voor de verschillende AI-modellen. Deze worden veilig opgeslagen in uw browser.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">OpenAI API Sleutel</label>
              <Input 
                type="password" 
                value={openaiKey} 
                onChange={e => setOpenaiKey(e.target.value)} 
                placeholder="sk-..." 
              />
              <p className="text-xs text-gray-500">Vereist voor GPT-4o</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Claude API Sleutel</label>
              <Input 
                type="password" 
                value={claudeKey} 
                onChange={e => setClaudeKey(e.target.value)} 
                placeholder="sk-ant-..." 
              />
              <p className="text-xs text-gray-500">Vereist voor Claude 3</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Gemini API Sleutel</label>
              <Input 
                type="password" 
                value={geminiKey} 
                onChange={e => setGeminiKey(e.target.value)} 
                placeholder="AIzaSy..." 
              />
              <p className="text-xs text-gray-500">Vereist voor Gemini Pro</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">DeepSeek API Sleutel</label>
              <Input 
                type="password" 
                value={deepseekKey} 
                onChange={e => setDeepseekKey(e.target.value)} 
                placeholder="sk-..." 
              />
              <p className="text-xs text-gray-500">Vereist voor DeepSeek Coder</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleSave} className="w-full">
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Opgeslagen!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sleutels Opslaan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
