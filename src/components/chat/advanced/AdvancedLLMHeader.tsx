
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getModelDisplayName } from './utils';

interface AdvancedLLMHeaderProps {
  selectedModelName: string;
  onExit: () => void;
}

const AdvancedLLMHeader: React.FC<AdvancedLLMHeaderProps> = ({
  selectedModelName,
  onExit
}) => {
  // Get the display name for the model
  const modelDisplayName = getModelDisplayName(selectedModelName);
  
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold">{modelDisplayName}</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={onExit} className="hover:bg-primary-foreground/10">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AdvancedLLMHeader;
