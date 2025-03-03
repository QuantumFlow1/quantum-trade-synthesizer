
import { Bot, AlertTriangle } from 'lucide-react';
import { EdgeFunctionStatus } from './types';

interface DeepSeekEmptyStateProps {
  edgeFunctionStatus?: EdgeFunctionStatus;
}

export function DeepSeekEmptyState({ edgeFunctionStatus = 'checking' }: DeepSeekEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
      {edgeFunctionStatus === 'unavailable' ? (
        <>
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">DeepSeek Service Unavailable</h3>
          <p className="max-w-md">
            The DeepSeek AI service is currently unavailable. This might be due to a temporary outage
            or deployment issue. Please try again later or use a different AI model.
          </p>
        </>
      ) : edgeFunctionStatus === 'checking' ? (
        <>
          <Bot className="h-16 w-16 text-blue-500/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Checking DeepSeek Availability</h3>
          <p className="max-w-md">
            Checking if the DeepSeek AI service is available...
          </p>
        </>
      ) : (
        <>
          <Bot className="h-16 w-16 text-blue-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">DeepSeek AI Chat</h3>
          <p className="max-w-md">
            This is a DeepSeek AI chat interface. DeepSeek is specialized for code generation and
            technical assistance.
          </p>
          <p className="mt-2 text-sm">
            Send a message to start a conversation. You'll need to provide your API key in settings.
          </p>
        </>
      )}
    </div>
  );
}
