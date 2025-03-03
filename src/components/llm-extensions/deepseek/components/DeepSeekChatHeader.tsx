
import { Bot, Loader2, RefreshCw, Settings, Trash2, Check, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EdgeFunctionStatus } from '../../types/chatTypes';

interface DeepSeekChatHeaderProps {
  hasApiKey: boolean;
  edgeFunctionStatus: EdgeFunctionStatus;
  onCheckApiStatus: () => void;
  onToggleSettings: () => void;
  onClearMessages: () => void;
}

export function DeepSeekChatHeader({
  hasApiKey,
  edgeFunctionStatus,
  onCheckApiStatus,
  onToggleSettings,
  onClearMessages
}: DeepSeekChatHeaderProps) {
  return (
    <div className="border-b py-3 px-4 flex flex-row items-center justify-between">
      <div className="text-lg font-medium flex items-center">
        <Bot className="h-5 w-5 mr-2 text-blue-500" />
        DeepSeek Chat
        {hasApiKey && (
          <Badge variant={edgeFunctionStatus === 'available' ? 'default' : 'outline'} className="ml-2">
            {edgeFunctionStatus === 'available' ? (
              <Check className="h-3 w-3 mr-1 text-green-500" />
            ) : edgeFunctionStatus === 'checking' ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <XCircle className="h-3 w-3 mr-1 text-red-500" />
            )}
            {edgeFunctionStatus === 'available' ? 'Connected' : 
              edgeFunctionStatus === 'checking' ? 'Checking...' : 'Disconnected'}
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCheckApiStatus}
          title="Check connection"
          className={edgeFunctionStatus === 'available' ? 'text-green-600' : 'text-yellow-600'}
        >
          {edgeFunctionStatus === 'checking' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggleSettings}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearMessages}
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
