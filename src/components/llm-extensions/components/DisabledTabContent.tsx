
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleLeft } from 'lucide-react';

interface DisabledTabContentProps {
  modelName: string;
  onEnable: () => void;
}

export const DisabledTabContent: React.FC<DisabledTabContentProps> = ({ modelName, onEnable }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center py-10 text-gray-500">
      <ToggleLeft className="h-12 w-12 mb-4 text-gray-400" />
      <h3 className="text-lg font-medium mb-2">{modelName} is currently disabled</h3>
      <p className="max-w-md mb-4">Click the toggle switch in the tab above to enable this LLM.</p>
      <Button 
        variant="outline" 
        onClick={onEnable}
      >
        Enable {modelName}
      </Button>
    </div>
  );
};
