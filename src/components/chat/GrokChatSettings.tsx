
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { GrokSettings } from './types/GrokSettings';
import { ModelSelector } from './settings/ModelSelector';
import { TemperatureControl } from './settings/TemperatureControl';
import { FeaturesToggle } from './settings/FeaturesToggle';
import { AI_MODELS } from './types/GrokSettings';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ServerCrash } from 'lucide-react';

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
    const groqKey = localStorage.getItem('groqApiKey');
    
    // If we have at least one key in localStorage but not in settings, update settings
    if ((openaiKey || claudeKey || geminiKey || deepseekKey || groqKey) && 
        (!settings.apiKeys.openaiApiKey && !settings.apiKeys.claudeApiKey && 
         !settings.apiKeys.geminiApiKey && !settings.apiKeys.deepseekApiKey &&
         !settings.apiKeys.groqApiKey)) {
      
      console.log('Found API keys in localStorage, updating settings');
      
      onSettingsChange({
        ...settings,
        apiKeys: {
          openaiApiKey: openaiKey || settings.apiKeys.openaiApiKey,
          claudeApiKey: claudeKey || settings.apiKeys.claudeApiKey,
          geminiApiKey: geminiKey || settings.apiKeys.geminiApiKey,
          deepseekApiKey: deepseekKey || settings.apiKeys.deepseekApiKey,
          groqApiKey: groqKey || settings.apiKeys.groqApiKey
        }
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
  
  const navigateToAdminPanel = () => {
    window.location.href = '/admin/api-keys';
  };

  // Get the currently selected model's full info
  const selectedModelInfo = AI_MODELS.find(model => model.id === settings.selectedModel);

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm space-y-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b">LLM Model Instellingen</h3>
      
      {/* API Key Management */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">API Sleutels</h4>
        
        <Alert>
          <ServerCrash className="h-4 w-4" />
          <AlertDescription>
            API sleutels kunnen alleen worden geconfigureerd in het Admin Paneel.
          </AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={navigateToAdminPanel}
        >
          Ga naar Admin API Sleutels
        </Button>
      </div>
      
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
