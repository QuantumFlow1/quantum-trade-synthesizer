
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GrokSettings } from './types/GrokSettings';
import { Search, Brain } from 'lucide-react';

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

  return (
    <div className="p-4 border-t bg-gray-50 space-y-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Grok Turbo Functies</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-600" />
          <Label htmlFor="deep-search" className="text-sm text-gray-700">Deep Search</Label>
        </div>
        <Switch 
          id="deep-search"
          checked={settings.deepSearchEnabled}
          onCheckedChange={handleDeepSearchToggle}
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
        />
      </div>
    </div>
  );
}
