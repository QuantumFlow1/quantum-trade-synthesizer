
import { Key } from 'lucide-react';
import { ModelInfo } from '../types/GrokSettings';

interface ApiKeyWarningProps {
  selectedModel: ModelInfo | undefined;
  hasApiKey: boolean;
  adminPanelPath?: string;
}

export function ApiKeyWarning({ selectedModel, hasApiKey, adminPanelPath = '/admin/api-keys' }: ApiKeyWarningProps) {
  // Only show warning if the model needs a key and it isn't set
  if (!selectedModel?.needsApiKey || hasApiKey) {
    return null;
  }
  
  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
      <p className="flex items-center">
        <Key className="h-4 w-4 mr-2" />
        Dit model heeft een API-sleutel nodig om te functioneren. Klik op 'API Sleutels' om deze in te stellen.
      </p>
    </div>
  );
}
