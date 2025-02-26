
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Brain } from 'lucide-react';

interface GrokFeaturesProps {
  deepSearchEnabled: boolean;
  thinkEnabled: boolean;
  onDeepSearchToggle: (checked: boolean) => void;
  onThinkToggle: (checked: boolean) => void;
  selectedModel: string;
}

export function GrokFeatures({ 
  deepSearchEnabled, 
  thinkEnabled, 
  onDeepSearchToggle, 
  onThinkToggle,
  selectedModel
}: GrokFeaturesProps) {
  return (
    <>
      <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3 pb-1 border-b">Grok Turbo Functies</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-600" />
          <Label htmlFor="deep-search" className="text-sm text-gray-700">Deep Search</Label>
        </div>
        <Switch 
          id="deep-search"
          checked={deepSearchEnabled}
          onCheckedChange={onDeepSearchToggle}
          disabled={selectedModel !== 'grok3'}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4 text-gray-600" />
          <Label htmlFor="think" className="text-sm text-gray-700">Think</Label>
        </div>
        <Switch 
          id="think"
          checked={thinkEnabled}
          onCheckedChange={onThinkToggle}
          disabled={selectedModel !== 'grok3'}
        />
      </div>
    </>
  );
}
