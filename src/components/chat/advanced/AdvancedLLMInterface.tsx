
import { useState, useEffect } from "react";
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
import { isInputValid, getModelDisplayName } from "./utils";

export default function AdvancedLLMInterface() {
  const navigate = useNavigate();
  
  // Retrieve services from the hook
  const { isLoading, grokSettings, setGrokSettings, sendMessage: sendGrokMessage } = useGrokChat();
  
  // State for the advanced interface
  const [selectedModel, setSelectedModel] = useState<ModelId>(grokSettings.selectedModel);
  const [temperature, setTemperature] = useState(grokSettings.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [task, setTask] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Sync settings with global settings
  useEffect(() => {
    setGrokSettings({
      ...grokSettings,
      selectedModel: selectedModel,
      temperature: temperature
    });
  }, [selectedModel, temperature]);
  
  // Handle model selection changes
  const handleModelChange = (model: string) => {
    setSelectedModel(model as ModelId);
    
    toast({
      title: "Model Changed",
      description: `Now using ${getModelDisplayName(model)} as the AI model.`,
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
    
    // Use the task as the input message if no message was provided
    if (!inputMessage && task) {
      setInputMessage(task);
      generateResponse(task);
    } else {
      generateResponse();
    }
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    generateResponse();
  };
  
  // Generate AI response
  const generateResponse = async (content = inputMessage) => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    
    // Add user message to conversation
    const userMessage = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Update settings before sending message
      const updatedSettings = {
        ...grokSettings,
        selectedModel: selectedModel,
        temperature: temperature
      };
      
      // Prepare the conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      console.log("Generating response with model:", selectedModel);
      console.log("Temperature:", temperature);
      console.log("Max tokens:", maxTokens);
      
      // In a real implementation, we would call the appropriate API based on the selected model
      // For now, we'll simulate the response
      let responseText;
      
      setTimeout(async () => {
        try {
          // Simulate calling the real API
          responseText = `This is a simulated response from ${getModelDisplayName(selectedModel)}. In a real implementation, this would come from the ${getModelDisplayName(selectedModel)} API with temperature ${temperature} and max tokens ${maxTokens}. The model would respond to: "${content}"`;
          
          // Add AI response to conversation
          const assistantMessage = { role: "assistant", content: responseText };
          setMessages(prev => [...prev, assistantMessage]);
          
          // Add to history
          setHistory(prev => [
            { task: content, output: responseText },
            ...prev
          ]);
          
          // Clear input if it was successful
          setInputMessage("");
        } catch (error) {
          console.error("Error generating response:", error);
          toast({
            title: "Error",
            description: "Failed to generate a response. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsGenerating(false);
        }
      }, 1500); // Simulate API response time
    } catch (error) {
      console.error("Error in generate response:", error);
      setIsGenerating(false);
      
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    }
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
            isLoading={isLoading || isGenerating}
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
}
