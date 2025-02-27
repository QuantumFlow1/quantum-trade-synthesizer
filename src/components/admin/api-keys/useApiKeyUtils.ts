
import { API_KEY_TYPES } from "./types";

export const useApiKeyUtils = () => {
  /**
   * Renders a masked version of an API key for display
   */
  const renderApiKeyMasked = (apiKey: string) => {
    // Check if the API key is shorter than 10 characters
    if (apiKey.length < 10) {
      return "••••••••";
    }
    
    // Show first 4 and last 4 characters, mask the rest
    const firstFour = apiKey.substring(0, 4);
    const lastFour = apiKey.substring(apiKey.length - 4);
    return `${firstFour}...${lastFour}`;
  };

  /**
   * Get the display name for a key type
   */
  const getKeyTypeName = (keyType: string) => {
    const keyTypeObj = API_KEY_TYPES.find(type => type.id === keyType);
    return keyTypeObj ? keyTypeObj.name : keyType;
  };

  return {
    renderApiKeyMasked,
    getKeyTypeName
  };
};
