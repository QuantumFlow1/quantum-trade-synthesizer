
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useDeepSeekChat } from './deepseek/hooks/useDeepSeekChat';
import { DeepSeekChatHeader } from './deepseek/components/DeepSeekChatHeader';
import { DeepSeekContent } from './deepseek/components/DeepSeekContent';
import { DeepSeekChatInput } from './deepseek/components/DeepSeekChatInput';

export function DeepSeekChat() {
  const {
    messages,
    isProcessing,
    edgeFunctionStatus,
    lastChecked,
    sendMessage,
    clearMessages,
    checkApiStatus
  } = useDeepSeekChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Load API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('deepseekApiKey') || '';
    setApiKey(savedKey);
  }, []);

  // Check if we have an API key
  const hasApiKey = !!apiKey;
  
  // Format last checked time
  const formattedLastChecked = lastChecked ? 
    new Intl.DateTimeFormat('default', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }).format(lastChecked) : null;

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('deepseekApiKey', key);
  };
  
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };
  
  const retryConnection = () => {
    checkApiStatus();
  };
  
  // Determine the appropriate placeholder text for the input field
  const getPlaceholderText = () => {
    if (!hasApiKey) return "Please set API key in settings";
    if (edgeFunctionStatus === 'unavailable') return "DeepSeek service unavailable";
    return "Type your message...";
  };

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="p-0">
        <DeepSeekChatHeader
          hasApiKey={hasApiKey}
          edgeFunctionStatus={edgeFunctionStatus}
          onCheckApiStatus={checkApiStatus}
          onToggleSettings={toggleSettings}
          onClearMessages={clearMessages}
        />
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden p-0">
        <DeepSeekContent
          messages={messages}
          showSettings={showSettings}
          apiKey={apiKey}
          saveApiKey={saveApiKey}
          onCloseSettings={() => setShowSettings(false)}
          edgeFunctionStatus={edgeFunctionStatus}
          formattedLastChecked={formattedLastChecked}
          onRetryConnection={retryConnection}
          hasApiKey={hasApiKey}
        />
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <DeepSeekChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          isDisabled={edgeFunctionStatus === 'unavailable' || !hasApiKey}
          placeholder={getPlaceholderText()}
        />
      </CardFooter>
    </Card>
  );
}
