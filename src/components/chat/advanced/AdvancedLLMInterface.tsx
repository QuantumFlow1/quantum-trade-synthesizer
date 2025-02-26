
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AI_MODELS } from '../types/GrokSettings';
import { useGrokChat } from '../useGrokChat';
import { useToast } from '@/components/ui/use-toast';
import AdvancedLLMHeader from './AdvancedLLMHeader';
import TaskAndModelSection from './TaskAndModelSection';
import ParametersSection from './ParametersSection';
import ContentGenerationSection from './ContentGenerationSection';
import HistorySection from './HistorySection';

const AdvancedLLMInterface: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    clearChat,
    grokSettings,
    setGrokSettings
  } = useGrokChat();

  // Task and parameters
  const [task, setTask] = useState<string>('market-analysis');
  const [maxTokens, setMaxTokens] = useState<number>(150);
  const [history, setHistory] = useState<Array<{ task: string; output: string }>>([]);
  
  // Update temperature from grokSettings when component mounts
  useEffect(() => {
    if (grokSettings.temperature) {
      setTemperature(grokSettings.temperature);
    }
  }, [grokSettings.temperature]);
  
  // Create local temperature state with setter that also updates grokSettings
  const [temperature, setTemperatureLocal] = useState<number>(grokSettings.temperature || 0.7);
  const setTemperature = (value: number) => {
    setTemperatureLocal(value);
    setGrokSettings({
      ...grokSettings,
      temperature: value
    });
  };
  
  // Selected model
  const selectedModel = AI_MODELS.find(m => m.id === grokSettings.selectedModel);
  const selectedModelName = selectedModel?.name || 'AI';

  const handleExit = () => {
    navigate('/');
    toast({
      title: "Interface verlaten",
      description: "Je hebt de AI interface verlaten.",
      duration: 3000,
    });
  };
  
  const handleModelChange = (modelId: string) => {
    setGrokSettings({
      ...grokSettings,
      selectedModel: modelId as any
    });
  };
  
  const handleGenerate = async () => {
    if (!inputMessage.trim()) {
      toast({
        title: "Geen input",
        description: "Voer eerst een prompt in voordat je genereert.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Combine task with input for context
    const contextualPrompt = `Taak: ${task}\n\n${inputMessage}`;
    await sendMessage(contextualPrompt);
    
    // Store in history
    if (messages.length > 0) {
      const lastResponse = messages[messages.length - 1].content;
      setHistory(prev => [...prev, { task, output: lastResponse }]);
    }
  };
  
  return (
    <Card className="w-full max-w-7xl mx-auto shadow-lg bg-white">
      {/* Header */}
      <AdvancedLLMHeader 
        selectedModelId={grokSettings.selectedModel}
        onExit={handleExit}
        onClearChat={clearChat}
      />
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Left side: Task selection and LLM choice */}
          <div className="w-full md:w-1/4 p-4 border-r">
            <TaskAndModelSection 
              task={task}
              setTask={setTask}
              selectedModel={grokSettings.selectedModel}
              onModelChange={handleModelChange}
            />

            <ParametersSection 
              temperature={temperature}
              setTemperature={setTemperature}
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
              handleGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Middle: Content generation window */}
          <ContentGenerationSection 
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            messages={messages}
            selectedModelName={selectedModelName}
          />

          {/* Right side: History */}
          <HistorySection history={history} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedLLMInterface;
