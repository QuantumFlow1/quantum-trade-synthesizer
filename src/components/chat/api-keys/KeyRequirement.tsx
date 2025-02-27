
import React from 'react';
import { Key } from 'lucide-react';
import { ModelInfo } from '../types/GrokSettings';

interface KeyRequirementProps {
  selectedModel: ModelInfo | undefined;
  hasCurrentModelKey: boolean;
}

export function KeyRequirement({ selectedModel, hasCurrentModelKey }: KeyRequirementProps) {
  // Check if the current model needs an API key
  const currentModelNeedsKey = selectedModel?.needsApiKey || false;
  
  if (!currentModelNeedsKey || hasCurrentModelKey) {
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
