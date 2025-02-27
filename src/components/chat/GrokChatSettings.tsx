
import { useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AI_MODELS, GrokSettings } from './types/GrokSettings';
import { Search, Brain, Cpu } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ApiKeyManager } from './api-keys/ApiKeyManager';
import { toast } from '@/hooks/use-toast';

interface GrokChatSettingsProps {
  settings: GrokSettings;
  onSettingsChange: (settings: GrokSettings) => void;
}

export function GrokChatSettings({ settings, onSettingsChange }: GrokChatSettingsProps) {
  // On component mount, check if we have keys stored in localStorage
  useEffect(() => {
    // Load API keys from localStorage if they exist
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    const geminiKey = localStorage.getItem('geminiApiKey');
    const deepseekKey = localStorage.getItem('deepseekApiKey');
    
    // If we have at least one key in localStorage but not in settings, update settings
    if ((openaiKey || claudeKey || geminiKey || deepseekKey) && 
        (!settings.apiKeys.openaiApiKey && !settings.apiKeys.claudeApiKey && 
         !settings.apiKeys.geminiApiKey && !settings.apiKeys.deepseekApiKey)) {
      
      console.log('Found API keys in localStorage, updating settings');
      
      onSettingsChange({
        ...settings,
        apiKeys: {
          openaiApiKey: openaiKey || settings.apiKeys.openaiApiKey,
          claudeApiKey: claudeKey || settings.apiKeys.claudeApiKey,
          geminiApiKey: geminiKey || settings.apiKeys.geminiApiKey,
          deepseekApiKey: deepseekKey || settings.apiKeys.deepseekApiKey
        }
      });
      
      // Show toast notification
      toast({
        title: "API Keys Loaded",
        description: "Your stored API keys have been loaded",
        duration: 3000
      });
    }
  }, []);
  
  const handleDeepSearchToggle = (checked: boolean) => {
    onSettingsChange({
      ...settings,
      deepSearchEnabled: checked
    });
  };

  const handleThinkToggle = (checked: boolean) => {
    onSettingsChange({
      ...settings,
      thinkEnabled: checked
    });
  };
  
  const handleModelChange = (modelId: string) => {
    onSettingsChange({
      ...settings,
      selectedModel: modelId as any
    });
    
    // Check if the model requires an API key
    const selectedModelInfo = AI_MODELS.find(model => model.id === modelId);
    if (selectedModelInfo?.needsApiKey) {
      // Check if we have the required API key
      let hasKey = false;
      switch (modelId) {
        case 'openai':
        case 'gpt-4':
        case 'gpt-3.5-turbo':
          hasKey = !!settings.apiKeys.openaiApiKey || !!localStorage.getItem('openaiApiKey');
          break;
        case 'claude':
        case 'claude-3-haiku':
        case 'claude-3-sonnet':
        case 'claude-3-opus':
          hasKey = !!settings.apiKeys.claudeApiKey || !!localStorage.getItem('claudeApiKey');
          break;
        case 'gemini':
        case 'gemini-pro':
          hasKey = !!settings.apiKeys.geminiApiKey || !!localStorage.getItem('geminiApiKey');
          break;
        case 'deepseek':
        case 'deepseek-chat':
          hasKey = !!settings.apiKeys.deepseekApiKey || !!localStorage.getItem('deepseekApiKey');
          break;
      }
      
      if (!hasKey) {
        // Alert the user that they need to set an API key
        toast({
          title: "API Key Required",
          description: `${selectedModelInfo.name} requires an API key. Please set it in the API Keys section.`,
          variant: "destructive",
          duration: 5000
        });
      }
    }
  };
  
  const handleTemperatureChange = (value: number[]) => {
    onSettingsChange({
      ...settings,
      temperature: value[0]
    });
  };
  
  const handleApiKeysChange = (apiKeys: any) => {
    console.log('API keys updated:', {
      openai: apiKeys.openaiApiKey ? 'present' : 'not set',
      claude: apiKeys.claudeApiKey ? 'present' : 'not set',
      gemini: apiKeys.geminiApiKey ? 'present' : 'not set',
      deepseek: apiKeys.deepseekApiKey ? 'present' : 'not set'
    });
    
    onSettingsChange({
      ...settings,
      apiKeys
    });
  };

  // Get the currently selected model's full info
  const selectedModelInfo = AI_MODELS.find(model => model.id === settings.selectedModel);

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm space-y-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b">LLM Model Instellingen</h3>
      
      {/* API Key Manager */}
      <ApiKeyManager 
        selectedModel={selectedModelInfo}
        apiKeys={settings.apiKeys}
        onApiKeysChange={handleApiKeysChange}
      />
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-gray-600" />
            <Label htmlFor="model-select" className="text-sm text-gray-700">AI Model</Label>
          </div>
          <span className="text-sm font-medium text-primary">{selectedModelInfo?.name || 'Onbekend model'}</span>
        </div>
        <Select 
          value={settings.selectedModel} 
          onValueChange={handleModelChange}
        >
          <SelectTrigger id="model-select" className="w-full">
            <SelectValue placeholder="Selecteer AI model" />
          </SelectTrigger>
          <SelectContent>
            {AI_MODELS.map(model => (
              <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Temperatuur slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature" className="text-sm text-gray-700">Temperatuur</Label>
          <span className="text-sm font-medium text-primary">{settings.temperature?.toFixed(1) || '0.7'}</span>
        </div>
        <Slider
          id="temperature"
          min={0}
          max={1}
          step={0.1}
          value={[settings.temperature || 0.7]}
          onValueChange={handleTemperatureChange}
        />
      </div>
      
      <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3 pb-1 border-b">Grok Turbo Functies</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-600" />
          <Label htmlFor="deep-search" className="text-sm text-gray-700">Deep Search</Label>
        </div>
        <Switch 
          id="deep-search"
          checked={settings.deepSearchEnabled}
          onCheckedChange={handleDeepSearchToggle}
          disabled={settings.selectedModel !== 'grok3'}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4 text-gray-600" />
          <Label htmlFor="think" className="text-sm text-gray-700">Think</Label>
        </div>
        <Switch 
          id="think"
          checked={settings.thinkEnabled}
          onCheckedChange={handleThinkToggle}
          disabled={settings.selectedModel !== 'grok3'}
        />
      </div>
    </div>
  );
}
