
import { useState } from "react";
import { AI_MODELS, ModelId } from "../types/GrokSettings";
import { HistoryItem } from "./types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useGrokChat } from "../useGrokChat";
import AdvancedLLMHeader from "./AdvancedLLMHeader";
import TaskAndModelSection from "./TaskAndModelSection";
import ParametersSection from "./ParametersSection";
import ContentGenerationSection from "./ContentGenerationSection";
import HistorySection from "./HistorySection";
import { isInputValid } from "./utils";

export default function AdvancedLLMInterface() {
  const navigate = useNavigate();
  
  // Retrieve services from the hook
  const { isLoading, grokSettings, setGrokSettings } = useGrokChat();
  
  // State for the advanced interface
  const [selectedModel, setSelectedModel] = useState<ModelId>(grokSettings.selectedModel);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [task, setTask] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Handle model selection changes
  const handleModelChange = (model: string) => {
    setSelectedModel(model as ModelId);
    setGrokSettings({
      ...grokSettings,
      selectedModel: model as ModelId,
    });
    
    toast({
      title: "Model Changed",
      description: `Now using ${model} as the AI model.`,
      duration: 3000,
    });
  };
  
  // Handle content generation
  const handleGenerate = () => {
    if (!isInputValid(inputMessage, task)) {
      toast({
        title: "Input Required",
        description: "Please enter a message or task description.",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message to conversation
    setMessages((prev) => [
      ...prev, 
      { role: "user", content: inputMessage || task }
    ]);
    
    // Simulate AI response for demonstration
    setTimeout(() => {
      const responseText = "This is a simulated AI response. In a real implementation, this would come from the AI model API based on your input message and parameters.";
      
      // Add AI response to conversation
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: responseText }
      ]);
      
      // Add to history
      setHistory((prev) => [
        { task: task || inputMessage, output: responseText },
        ...prev,
      ]);
      
      // Clear input
      setInputMessage("");
    }, 1500);
  };
  
  // Handle exit to main chat
  const handleExit = () => {
    navigate('/chat');
    
    toast({
      title: "Returned to Standard Interface",
      description: "You are now using the standard chat interface.",
      duration: 3000,
    });
  };
  
  // Get the currently selected model's name
  const selectedModelName = selectedModel;
  
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <AdvancedLLMHeader 
        selectedModelName={selectedModelName} 
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
            isLoading={isLoading}
          />
        </div>
        
        {/* Right column - Content Generation & History */}
        <div className="lg:col-span-2 space-y-6">
          <ContentGenerationSection 
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            messages={messages}
            selectedModelName={selectedModelName}
          />
          
          <HistorySection history={history} />
        </div>
      </div>
    </div>
  );
}
