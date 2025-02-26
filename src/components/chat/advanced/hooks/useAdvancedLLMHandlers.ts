
import { toast } from "@/components/ui/use-toast";
import { isInputValid, getModelDisplayName } from "../utils";
import { ModelId } from "../../types/GrokSettings";
import { HistoryItem } from "../types";

/**
 * Handlers and operations for Advanced LLM interface
 */
export const createAdvancedLLMHandlers = (
  state: {
    selectedModel: ModelId;
    temperature: number;
    maxTokens: number;
    inputMessage: string;
    messages: Array<{role: string; content: string}>;
    task: string;
    setMessages: React.Dispatch<React.SetStateAction<Array<{role: string; content: string}>>>;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
    setGrokSettings: (settings: any) => void;
    grokSettings: any;
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
    sendGrokMessage: (content: string) => Promise<void>;
    setSelectedModel: React.Dispatch<React.SetStateAction<ModelId>>;
  }
) => {
  // Handle model selection changes
  const handleModelChange = (model: string) => {
    // Update the local state
    state.setSelectedModel(model as ModelId);
    
    // Update the global settings
    state.setGrokSettings({
      ...state.grokSettings,
      selectedModel: model as ModelId
    });
    
    toast({
      title: "Model Changed",
      description: `Now using ${getModelDisplayName(model)} as the AI model.`,
      duration: 3000,
    });
  };

  // Generate AI response
  const generateResponse = async (content = state.inputMessage) => {
    if (!content.trim()) return;
    
    state.setIsGenerating(true);
    
    try {
      // Add user message to conversation immediately
      const userMessage = { role: "user", content };
      state.setMessages(prev => [...prev, userMessage]);
      
      // Clear input field right away
      state.setInputMessage("");
      
      // Update settings before sending message
      const updatedSettings = {
        ...state.grokSettings,
        selectedModel: state.selectedModel,
        temperature: state.temperature,
        maxTokens: state.maxTokens
      };
      
      console.log("Generating response with model:", state.selectedModel);
      console.log("Temperature:", state.temperature);
      console.log("Max tokens:", state.maxTokens);
      
      // Set updated settings for the API call
      state.setGrokSettings(updatedSettings);
      
      // Use the API integration from useGrokChat
      await state.sendGrokMessage(content);
      
      // Note: The actual AI response will be added to the messages array 
      // by the useGrokChat hook, so we don't need to manually add it here
      
      toast({
        title: "Response Generated",
        description: `${getModelDisplayName(state.selectedModel)} has responded to your query.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Add error message to conversation
      const errorMessage = { 
        role: "assistant", 
        content: "Sorry, I couldn't generate a response. Please try again." 
      };
      state.setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      state.setIsGenerating(false);
    }
  };
  
  // Handle content generation
  const handleGenerate = () => {
    if (!isInputValid(state.inputMessage, state.task)) {
      toast({
        title: "Input Required",
        description: "Please enter a message or task description.",
        variant: "destructive",
      });
      return;
    }
    
    // Use the task as the input message if no message was provided
    if (!state.inputMessage && state.task) {
      state.setInputMessage(state.task);
      generateResponse(state.task);
    } else {
      generateResponse();
    }
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!state.inputMessage.trim()) return;
    generateResponse();
  };

  return {
    handleModelChange,
    handleGenerate,
    handleSendMessage,
    generateResponse
  };
};
