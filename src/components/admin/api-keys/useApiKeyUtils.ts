
import { API_KEY_TYPES } from "./types";

export const useApiKeyUtils = () => {
  const getKeyTypeName = (type: string): string => {
    const keyType = API_KEY_TYPES.find(t => t.id === type);
    return keyType ? keyType.name : type;
  };

  const renderApiKeyMasked = (apiKey: string): string => {
    if (apiKey.length <= 8) return '••••••••';
    return apiKey.substring(0, 4) + '••••••••' + apiKey.substring(apiKey.length - 4);
  };

  return { getKeyTypeName, renderApiKeyMasked };
};
