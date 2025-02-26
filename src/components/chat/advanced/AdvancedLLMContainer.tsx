
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAdvancedLLM } from "./hooks/useAdvancedLLM";
import AdvancedLLMHeader from "./AdvancedLLMHeader";
import TaskAndModelSection from "./TaskAndModelSection";
import ParametersSection from "./ParametersSection";
import ContentGenerationSection from "./ContentGenerationSection";
import HistorySection from "./HistorySection";

export const AdvancedLLMContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    // State
    selectedModel,
    temperature,
    maxTokens,
    inputMessage,
    messages,
    task,
    history,
    isGenerating,
    isApiLoading,
    
    // Setters
    setTemperature,
    setMaxTokens,
    setInputMessage,
    setTask,
    
    // Handlers
    handleModelChange,
    handleGenerate,
    handleSendMessage
  } = useAdvancedLLM();
  
  // Handle exit to main chat
  const handleExit = () => {
    navigate('/chat');
    
    toast({
      title: "Returned to Standard Interface",
      description: "You are now using the standard chat interface.",
      duration: 3000,
    });
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <AdvancedLLMHeader 
        selectedModelName={selectedModel} 
        onExit={handleExit} 
      />
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Task & Parameters */}
        <div className="lg:col-span-1 space-y-6">
          <TaskAndModelSection 
            task={task}
            setTask={setTask}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
          
          <ParametersSection 
            temperature={temperature}
            setTemperature={setTemperature}
            maxTokens={maxTokens}
            setMaxTokens={setMaxTokens}
            handleGenerate={handleGenerate}
            isLoading={isApiLoading || isGenerating}
          />
        </div>
        
        {/* Right column - Content Generation & History */}
        <div className="lg:col-span-2 space-y-6">
          <ContentGenerationSection 
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            messages={messages}
            selectedModelName={selectedModel}
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
          />
          
          <HistorySection history={history} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedLLMContainer;
