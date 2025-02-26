
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
