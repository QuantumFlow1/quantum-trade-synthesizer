
import { useEffect } from 'react';
import { ApiKeyManager } from './ApiKeyManager';
import { toast } from '@/hooks/use-toast';
import { GrokSettings } from './types/GrokSettings';
import { ModelSelector } from './settings/ModelSelector';
import { TemperatureControl } from './settings/TemperatureControl';
import { FeaturesToggle } from './settings/FeaturesToggle';
import { AI_MODELS } from './types/GrokSettings';

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
      
      {/* Model Selector */}
      <ModelSelector 
        selectedModel={settings.selectedModel}
        onModelChange={handleModelChange}
      />
      
      {/* Temperature Control */}
      <TemperatureControl
        temperature={settings.temperature || 0.7}
        onTemperatureChange={handleTemperatureChange}
      />
      
      {/* Grok-specific Features */}
      <FeaturesToggle
        deepSearchEnabled={settings.deepSearchEnabled}
        thinkEnabled={settings.thinkEnabled}
        selectedModel={settings.selectedModel}
        onDeepSearchToggle={handleDeepSearchToggle}
        onThinkToggle={handleThinkToggle}
      />
    </div>
  );
}
