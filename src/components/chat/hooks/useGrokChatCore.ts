
import { useGrokMessages } from './useGrokMessages';
import { useGrokSettings } from './useGrokSettings';
import { useSendMessage } from './useSendMessage';
import { useApiAvailability } from './useApiAvailability';

export function useGrokChatCore(skipInitialization = false) {
  // Check if we're in the admin context by examining the URL
  const isAdminContext = typeof window !== 'undefined' && 
    (window.location.pathname.includes('/admin') || skipInitialization);
  
  // Use the extracted hooks
  const {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isProcessing,
    setIsProcessing,
    clearChat
  } = useGrokMessages(isAdminContext);
  
  const { grokSettings, setGrokSettings } = useGrokSettings(isAdminContext);
  
  const { 
    apiAvailable, 
    isLoading: isApiCheckLoading, 
    checkGrokAvailability, 
    retryApiConnection 
  } = useApiAvailability(isAdminContext);
  
  const { sendMessage } = useSendMessage({
    isAdminContext,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    setIsProcessing,
    apiAvailable,
    checkGrokAvailability,
    grokSettings
  });

  return {
    // Message state
    messages,
    inputMessage,
    setInputMessage,
    isLoading: isApiCheckLoading || isProcessing,
    sendMessage,
    clearChat,
    
    // API state
    apiAvailable,
    retryApiConnection,
    
    // Settings
    grokSettings,
    setGrokSettings
  };
}
