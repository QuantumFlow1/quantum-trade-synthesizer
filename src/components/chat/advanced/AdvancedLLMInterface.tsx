
import React, { useState } from 'react';
import AdvancedLLMHeader from './AdvancedLLMHeader';
import TaskAndModelSection from './TaskAndModelSection';
import ParametersSection from './ParametersSection';
import ContentGenerationSection from './ContentGenerationSection';
import HistorySection from './HistorySection';
import { useGrokChat } from '../useGrokChat';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { AI_MODELS } from '../types/GrokSettings';
import { HistoryItem } from './types';

const AdvancedLLMInterface: React.FC = () => {
  const navigate = useNavigate();
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    grokSettings,
    setGrokSettings
  } = useGrokChat();

  // Convert messages to the format expected by ContentGenerationSection
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content
  }));

  // State for task selection
  const [task, setTask] = useState('educational-content');

  // State for advanced parameters
  const [temperature, setTemperature] = useState(grokSettings.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(1000);

  // Mock history data (can be replaced with actual history later)
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleGenerate = () => {
    if (!inputMessage.trim()) {
      toast({
        title: "Lege prompt",
        description: "Voer een prompt in om te genereren.",
        variant: "destructive"
      });
      return;
    }

    // Update grokSettings with the current temperature
    setGrokSettings({ ...grokSettings, temperature });

    // Send the message
    sendMessage();

    // Add to history
    if (inputMessage.trim()) {
      setHistory(prev => [...prev, {
        task,
        output: "Generatie is gestart..." // Will be updated with actual output later
      }]);
    }
  };

  const handleExit = () => {
    navigate('/');
    toast({
      title: "Advanced interface verlaten",
      description: "Je hebt de geavanceerde interface verlaten.",
      duration: 3000,
    });
  };

  // Get the full name of the selected model
  const selectedModel = AI_MODELS.find(m => m.id === grokSettings.selectedModel);
  const selectedModelName = selectedModel?.name || 'AI';

  const handleModelChange = (modelId: string) => {
    setGrokSettings({ ...grokSettings, selectedModel: modelId as any });
  };

  return (
    <div className="w-full max-w-7xl mx-auto shadow-lg bg-white rounded-lg overflow-hidden">
      <AdvancedLLMHeader 
        selectedModelName={selectedModelName} 
        onExit={handleExit} 
      />
      
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-4 border-r">
          <TaskAndModelSection 
            task={task}
            setTask={setTask}
            selectedModel={grokSettings.selectedModel}
            onModelChange={handleModelChange}
          />
          
          <div className="mt-8">
            <ParametersSection 
              temperature={temperature}
              setTemperature={setTemperature}
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
              handleGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <ContentGenerationSection 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          messages={formattedMessages}
          selectedModelName={selectedModelName}
        />
        
        <HistorySection history={history} />
      </div>
    </div>
  );
};

export default AdvancedLLMInterface;
