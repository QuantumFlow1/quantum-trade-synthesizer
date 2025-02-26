
import { useEffect } from "react";
import { useAdvancedLLMState } from "./useAdvancedLLMState";
import { createAdvancedLLMHandlers } from "./useAdvancedLLMHandlers";
import { useAdvancedLLMEffects } from "./useAdvancedLLMEffects";
import { ModelId } from "../../types/GrokSettings";
import { useGrokChat } from "../../useGrokChat";

/**
 * Main hook for the Advanced LLM interface
 * Combines state, handlers, and effects
 */
export const useAdvancedLLM = () => {
  // Get all state variables from the state hook
  const state = useAdvancedLLMState();
  
  // Get the sendMessage function from useGrokChat
  const { sendMessage: sendGrokMessage } = useGrokChat();
  
  // Create handlers with access to state
  const handlers = createAdvancedLLMHandlers({
    ...state,
    sendGrokMessage
  });
  
  // Set up side effects
  useAdvancedLLMEffects(
    state.selectedModel,
    state.apiAvailable,
    state.temperature,
    state.grokSettings,
    state.setGrokSettings
  );

  return {
    // State
    selectedModel: state.selectedModel,
    temperature: state.temperature,
    maxTokens: state.maxTokens,
    inputMessage: state.inputMessage,
    messages: state.messages,
    task: state.task,
    history: state.history,
    isGenerating: state.isGenerating,
    isApiLoading: state.isApiLoading,
    apiAvailable: state.apiAvailable,
    
    // Setters
    setSelectedModel: state.setSelectedModel,
    setTemperature: state.setTemperature,
    setMaxTokens: state.setMaxTokens,
    setInputMessage: state.setInputMessage,
    setTask: state.setTask,
    
    // Handlers
    handleModelChange: handlers.handleModelChange,
    handleGenerate: handlers.handleGenerate,
    handleSendMessage: handlers.handleSendMessage,
    generateResponse: handlers.generateResponse
  };
};
