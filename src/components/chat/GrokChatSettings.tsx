
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AI_MODELS, GrokSettings } from './types/GrokSettings';
import { Search, Brain, Cpu } from 'lucide-react';

interface GrokChatSettingsProps {
  settings: GrokSettings;
  onSettingsChange: (settings: GrokSettings) => void;
}

export function GrokChatSettings({ settings, onSettingsChange }: GrokChatSettingsProps) {
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

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm space-y-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b">LLM Model Instellingen</h3>
      
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Cpu className="h-4 w-4 text-gray-600" />
          <Label htmlFor="model-select" className="text-sm text-gray-700">AI Model</Label>
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
