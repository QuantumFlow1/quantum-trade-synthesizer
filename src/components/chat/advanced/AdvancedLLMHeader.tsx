
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { AI_MODELS } from '../types/GrokSettings';

interface AdvancedLLMHeaderProps {
  selectedModelId: string;
  onExit: () => void;
  onClearChat: () => void;
}

const AdvancedLLMHeader: React.FC<AdvancedLLMHeaderProps> = ({
  selectedModelId,
  onExit,
  onClearChat
}) => {
  const selectedModel = AI_MODELS.find(m => m.id === selectedModelId);
  const selectedModelName = selectedModel?.name || 'AI';

  return (
    <div className="border-b py-4 px-6 flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onExit}
          title="Verlaat interface"
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Geavanceerde {selectedModelName} Interface</h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClearChat}
          title="Wis chat geschiedenis"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AdvancedLLMHeader;
