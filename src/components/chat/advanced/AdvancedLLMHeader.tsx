
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AdvancedLLMHeaderProps } from './types';

const AdvancedLLMHeader: React.FC<AdvancedLLMHeaderProps> = ({ selectedModelName, onExit }) => {
  return (
    <div className="bg-indigo-700 text-white p-4 flex justify-between items-center">
      <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-600" onClick={onExit}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-xl font-bold">{selectedModelName} Geavanceerde Interface</h1>
      <div className="w-9"></div> {/* Spacer for alignment */}
    </div>
  );
};

export default AdvancedLLMHeader;
