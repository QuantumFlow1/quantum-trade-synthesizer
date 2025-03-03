
import { AlertTriangle, Key } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EdgeFunctionStatus } from '../../types/chatTypes';

interface DeepSeekStatusAlertsProps {
  hasApiKey: boolean;
  edgeFunctionStatus: EdgeFunctionStatus;
  formattedLastChecked: string | null;
  onRetryConnection: () => void;
}

export function DeepSeekStatusAlerts({
  hasApiKey,
  edgeFunctionStatus,
  formattedLastChecked,
  onRetryConnection
}: DeepSeekStatusAlertsProps) {
  return (
    <>
      {!hasApiKey && edgeFunctionStatus !== 'unavailable' && (
        <Alert className="mb-2">
          <Key className="h-4 w-4" />
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription>
            You need to set a DeepSeek API key to use this chat. Click the settings icon to add your API key.
          </AlertDescription>
        </Alert>
      )}
      
      {edgeFunctionStatus === 'unavailable' && hasApiKey && (
        <Alert variant="destructive" className="mb-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Unable to connect to the DeepSeek API. Please check your API key and try again.
              {formattedLastChecked && <span className="block text-xs opacity-70">Last checked: {formattedLastChecked}</span>}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetryConnection}
              className="mt-2"
            >
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
