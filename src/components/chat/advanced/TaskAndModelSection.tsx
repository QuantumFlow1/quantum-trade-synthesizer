
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AI_MODELS } from '../types/GrokSettings';
import { TaskAndModelSectionProps } from './types';

const TaskAndModelSection: React.FC<TaskAndModelSectionProps> = ({
  task,
  setTask,
  selectedModel,
  onModelChange
}) => {
  return (
    <>
      <h2 className="text-lg font-bold mb-4">Taakselectie</h2>
      <Select
        value={task}
        onValueChange={setTask}
      >
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Selecteer een taak" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="market-analysis">Marktanalyse</SelectItem>
          <SelectItem value="educational-content">Educatieve Content</SelectItem>
          <SelectItem value="trading-advice">Trading Advies</SelectItem>
        </SelectContent>
      </Select>

      <h2 className="text-lg font-bold mb-4">LLM Model</h2>
      <Select
        value={selectedModel}
        onValueChange={onModelChange}
      >
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Selecteer een model" />
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map(model => (
            <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default TaskAndModelSection;
