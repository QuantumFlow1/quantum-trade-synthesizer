
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useGrokChat } from "../../useGrokChat";
import { AI_MODELS, ModelId } from "../../types/GrokSettings";
import { HistoryItem } from "../types";
import { isInputValid, getModelDisplayName } from "../utils";

export const useAdvancedLLM = () => {
  // Retrieve services from the hook
  const { 
    isLoading: isApiLoading, 
    grokSettings, 
    setGrokSettings, 
    sendMessage: sendGrokMessage,
    apiAvailable 
  } = useGrokChat();
  
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
        temperature: temperature,
        maxTokens: maxTokens
      };
      
      // Prepare the conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      console.log("Generating response with model:", selectedModel);
      console.log("Temperature:", temperature);
      console.log("Max tokens:", maxTokens);
      
      // Call the actual API through the hook
      let responseText;
      
      try {
        // Set updated settings for the API call
        setGrokSettings(updatedSettings);
        
        // Use the API integration from useGrokChat
        await sendGrokMessage(content);
        
        // Since sendGrokMessage adds the response to its own state,
        // we'll simulate a response here for this component's state
        responseText = `This is a response from ${getModelDisplayName(selectedModel)}. In a real implementation, the response has been added to the chat history via the sendGrokMessage function.`;
        
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
        
        toast({
          title: "Response Generated",
          description: `${getModelDisplayName(selectedModel)} has responded to your query.`,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error generating response:", error);
        
        // Add error message to conversation
        const errorMessage = { 
          role: "assistant", 
          content: "Sorry, I couldn't generate a response. Please try again." 
        };
        setMessages(prev => [...prev, errorMessage]);
        
        toast({
          title: "Error",
          description: "Failed to generate a response. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in generate response:", error);
      
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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

  // Check if the selected model is available
  useEffect(() => {
    if (selectedModel === 'grok3' && apiAvailable === false) {
      toast({
        title: "Grok3 API Unavailable",
        description: "The Grok3 API is currently unavailable. Your messages will be processed by an alternative model.",
        variant: "warning",
        duration: 5000,
      });
    }
  }, [selectedModel, apiAvailable]);

  return {
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
    apiAvailable,
    
    // Setters
    setSelectedModel,
    setTemperature,
    setMaxTokens,
    setInputMessage,
    setTask,
    
    // Handlers
    handleModelChange,
    handleGenerate,
    handleSendMessage,
    generateResponse
  };
};
