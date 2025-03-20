
import { AlertTriangle, Key, ServerCrash } from 'lucide-react';
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
  const navigateToAdminPanel = () => {
    window.location.href = '/admin/api-keys';
  };

  return (
    <>
      {!hasApiKey && (
        <Alert className="mb-2">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>API Sleutel Vereist</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              API sleutels kunnen alleen worden geconfigureerd in het Admin Paneel.
              Neem contact op met uw systeembeheerder voor toegang.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateToAdminPanel}
              className="mt-2"
            >
              Naar Admin Paneel
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {edgeFunctionStatus === 'unavailable' && hasApiKey && (
        <Alert variant="destructive" className="mb-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Unable to connect to the DeepSeek API. Please check your API key in the Admin Panel.
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
