
import { useRef, useEffect } from 'react';
import { DeepSeekMessage } from '../DeepSeekMessage';
import { DeepSeekEmptyState } from '../DeepSeekEmptyState';
import { DeepSeekSettings } from '../DeepSeekSettings';
import { DeepSeekStatusAlerts } from './DeepSeekStatusAlerts';
import { Message, EdgeFunctionStatus } from '../../types/chatTypes';

interface DeepSeekContentProps {
  messages: Message[];
  showSettings: boolean;
  apiKey: string;
  saveApiKey: (key: string) => void;
  onCloseSettings: () => void;
  edgeFunctionStatus: EdgeFunctionStatus;
  formattedLastChecked: string | null;
  onRetryConnection: () => void;
  hasApiKey: boolean;
}

export function DeepSeekContent({
  messages,
  showSettings,
  apiKey,
  saveApiKey,
  onCloseSettings,
  edgeFunctionStatus,
  formattedLastChecked,
  onRetryConnection,
  hasApiKey
}: DeepSeekContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
      <DeepSeekStatusAlerts
        hasApiKey={hasApiKey}
        edgeFunctionStatus={edgeFunctionStatus}
        formattedLastChecked={formattedLastChecked}
        onRetryConnection={onRetryConnection}
      />
      
      {showSettings ? (
        <DeepSeekSettings 
          apiKey={apiKey} 
          setApiKey={saveApiKey}
          onClose={onCloseSettings} 
        />
      ) : messages.length === 0 ? (
        <DeepSeekEmptyState edgeFunctionStatus={edgeFunctionStatus} />
      ) : (
        messages.map((message) => (
          <DeepSeekMessage key={message.id} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
