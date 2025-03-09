
import { Check, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'unavailable' | 'checking';
  llm: string;
}

export function ConnectionStatus({ status, llm }: ConnectionStatusProps) {
  // If connected, don't show anything to save space
  if (status === 'connected') return null;

  const getLLMName = (value: string) => {
    switch (value) {
      case 'deepseek':
        return 'DeepSeek';
      case 'openai':
        return 'OpenAI';
      case 'grok':
        return 'Grok';
      case 'claude':
        return 'Claude';
      default:
        return value;
    }
  };

  const statusConfig = {
    checking: {
      icon: <Loader2 className="h-4 w-4 mr-2 animate-spin" />,
      text: `Checking ${getLLMName(llm)} connection...`,
      className: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    disconnected: {
      icon: <AlertTriangle className="h-4 w-4 mr-2" />,
      text: `${getLLMName(llm)} is not connected. Please set up your API key.`,
      className: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    unavailable: {
      icon: <XCircle className="h-4 w-4 mr-2" />,
      text: `${getLLMName(llm)} service is currently unavailable.`,
      className: 'bg-red-50 text-red-700 border-red-200'
    },
    connected: {
      icon: <Check className="h-4 w-4 mr-2" />,
      text: `${getLLMName(llm)} is connected and ready.`,
      className: 'bg-green-50 text-green-700 border-green-200'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`p-2 px-4 text-sm flex items-center ${config.className}`}>
      {config.icon}
      {config.text}
    </div>
  );
}
