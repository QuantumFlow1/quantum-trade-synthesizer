
import { AI_MODELS, ModelId } from "../types/GrokSettings";

/**
 * Validates if the user has provided input
 */
export const isInputValid = (
  inputMessage: string,
  task: string
): boolean => {
  return !!(inputMessage.trim() || task.trim());
};

/**
 * Gets the display name for a model based on its ID
 */
export const getModelDisplayName = (modelId: string): string => {
  const model = AI_MODELS.find(m => m.id === modelId);
  return model ? model.name : modelId;
};

/**
 * Formats a task string for display in history
 */
export const formatTaskForHistory = (task: string): string => {
  // If task is longer than 50 characters, truncate and add ellipsis
  if (task.length > 50) {
    return `${task.substring(0, 47)}...`;
  }
  return task;
};

/**
 * Truncates a message to a specified length
 */
export const truncateMessage = (message: string, maxLength: number): string => {
  if (message.length <= maxLength) {
    return message;
  }
  return `${message.substring(0, maxLength - 3)}...`;
};

/**
 * Formats temperature value for display
 */
export const formatTemperature = (temperature: number): string => {
  return temperature.toFixed(2);
};

/**
 * Formats token count for display
 */
export const formatTokens = (tokens: number): string => {
  return tokens.toLocaleString();
};

/**
 * Validates if a temperature value is within valid range
 */
export const isTemperatureValid = (temperature: number): boolean => {
  return temperature >= 0 && temperature <= 1;
};

/**
 * Validates if max tokens value is within valid range
 */
export const isMaxTokensValid = (maxTokens: number): boolean => {
  return maxTokens >= 1 && maxTokens <= 4096;
};
