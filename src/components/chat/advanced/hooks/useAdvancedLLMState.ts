
import { useState } from "react";
import { HistoryItem } from "../types";
import { ModelId } from "../../types/GrokSettings";
import { useGrokChat } from "../../useGrokChat";

/**
 * Manages state for the Advanced LLM interface
 */
export const useAdvancedLLMState = () => {
  const { 
    isLoading: isApiLoading, 
    grokSettings, 
    setGrokSettings, 
    apiAvailable 
  } = useGrokChat();
  
  // Model selection and parameters
  const [selectedModel, setSelectedModel] = useState<ModelId>(grokSettings.selectedModel);
  const [temperature, setTemperature] = useState(grokSettings.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  
  // Conversation state
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [task, setTask] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  return {
    // API-related state
    isApiLoading,
    grokSettings,
    setGrokSettings,
    apiAvailable,
    
    // Model and parameters state
    selectedModel,
    setSelectedModel,
    temperature, 
    setTemperature,
    maxTokens,
    setMaxTokens,
    
    // Conversation state
    inputMessage,
    setInputMessage,
    messages,
    setMessages,
    task,
    setTask,
    history,
    setHistory,
    isGenerating,
    setIsGenerating
  };
};
