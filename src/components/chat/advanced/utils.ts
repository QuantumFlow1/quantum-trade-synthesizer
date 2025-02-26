
import { formatNumber } from "@/lib/utils";

/**
 * Formats a temperature value for display
 * @param temperature Temperature value (0-1)
 * @returns Formatted temperature string
 */
export const formatTemperature = (temperature: number): string => {
  return temperature.toFixed(2);
};

/**
 * Formats max tokens value for display (e.g., 2000 -> 2K)
 * @param tokens Number of tokens
 * @returns Formatted token string
 */
export const formatTokens = (tokens: number): string => {
  return formatNumber(tokens);
};

/**
 * Validates that the temperature is within the allowed range
 * @param temperature Temperature value to validate
 * @returns True if valid, false otherwise
 */
export const isTemperatureValid = (temperature: number): boolean => {
  return temperature >= 0 && temperature <= 1;
};

/**
 * Validates that max tokens is within an acceptable range
 * @param tokens Token value to validate
 * @returns True if valid, false otherwise
 */
export const isMaxTokensValid = (tokens: number): boolean => {
  return tokens >= 1 && tokens <= 4096;
};

/**
 * Truncates a message to a certain length and adds ellipsis if needed
 * @param message Message to truncate
 * @param maxLength Maximum allowed length
 * @returns Truncated message
 */
export const truncateMessage = (message: string, maxLength: number = 100): string => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + "...";
};

/**
 * Creates a formatted timestamp for display
 * @returns Formatted timestamp string
 */
export const getFormattedTimestamp = (): string => {
  return new Date().toLocaleTimeString();
};

/**
 * Gets a display name for a model ID
 * @param modelId The model ID (e.g., 'grok3', 'openai')
 * @returns User-friendly model name
 */
export const getModelDisplayName = (modelId: string): string => {
  const modelMap: Record<string, string> = {
    'grok3': 'Grok 3',
    'openai': 'GPT-4o',
    'claude': 'Claude 3',
    'gemini': 'Gemini Pro',
    'deepseek': 'DeepSeek Coder'
  };
  
  return modelMap[modelId] || modelId;
};

/**
 * Calculates estimated cost based on token usage
 * @param modelId The model ID
 * @param tokens Number of tokens
 * @returns Estimated cost in USD
 */
export const calculateEstimatedCost = (modelId: string, tokens: number): number => {
  const ratePerToken: Record<string, number> = {
    'grok3': 0.000015,
    'openai': 0.00002,
    'claude': 0.000025,
    'gemini': 0.00001,
    'deepseek': 0.000012
  };
  
  const rate = ratePerToken[modelId] || 0.00002; // Default to OpenAI rate
  return tokens * rate;
};

/**
 * Formats a task name for the history display
 * @param task Task string to format
 * @returns Formatted task string
 */
export const formatTaskForHistory = (task: string): string => {
  if (!task) return "General Query";
  return truncateMessage(task, 30);
};

/**
 * Validates if the input is ready for submission
 * @param inputMessage The message input
 * @param task The current task
 * @returns True if valid for submission
 */
export const isInputValid = (inputMessage: string, task: string): boolean => {
  // At least one of them should have content
  return !!(inputMessage.trim() || task.trim());
};
