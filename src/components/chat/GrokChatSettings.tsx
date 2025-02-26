
import { useEffect } from 'react';
import { GrokSettings, ModelInfo, AI_MODELS } from './types/GrokSettings';
import { ApiKeyManager } from './ApiKeyManager';
import { toast } from '@/hooks/use-toast';
import { ModelSelector } from './settings/ModelSelector';
import { TemperatureControl } from './settings/TemperatureControl';
import { GrokFeatures } from './settings/GrokFeatures';
import { ApiKeyWarning } from './settings/ApiKeyWarning';

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

  // Helper function to check if current model has API key set
  const hasCurrentModelKey = () => {
    if (!selectedModelInfo) return false;
    
    switch (selectedModelInfo.id) {
      case 'openai':
      case 'gpt-4':
      case 'gpt-3.5-turbo':
        return !!settings.apiKeys.openaiApiKey;
      case 'claude':
      case 'claude-3-haiku':
      case 'claude-3-sonnet':
      case 'claude-3-opus':
        return !!settings.apiKeys.claudeApiKey;
      case 'gemini':
      case 'gemini-pro':
        return !!settings.apiKeys.geminiApiKey;
      case 'deepseek':
      case 'deepseek-chat':
        return !!settings.apiKeys.deepseekApiKey;
      default:
        return true;
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm space-y-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b">LLM Model Instellingen</h3>
      
      {/* API Key Warning */}
      <ApiKeyWarning 
        selectedModel={selectedModelInfo}
        hasCurrentModelKey={hasCurrentModelKey}
      />
      
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
        apiKeys={settings.apiKeys}
      />
      
      {/* Temperature Slider */}
      <TemperatureControl 
        temperature={settings.temperature || 0.7}
        onTemperatureChange={handleTemperatureChange}
      />
      
      {/* Grok Features */}
      <GrokFeatures 
        deepSearchEnabled={settings.deepSearchEnabled}
        thinkEnabled={settings.thinkEnabled}
        onDeepSearchToggle={handleDeepSearchToggle}
        onThinkToggle={handleThinkToggle}
        selectedModel={settings.selectedModel}
      />
    </div>
  );
}
