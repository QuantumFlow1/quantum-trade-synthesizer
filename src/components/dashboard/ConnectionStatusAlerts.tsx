
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, WifiOff, Info } from "lucide-react";

interface ConnectionStatusAlertsProps {
  connectionStatus: 'checking' | 'connected' | 'error' | 'offline';
  isRetrying: boolean;
  checkConnection: () => void;
}

export const ConnectionStatusAlerts: React.FC<ConnectionStatusAlertsProps> = ({
  connectionStatus,
  isRetrying,
  checkConnection
}) => {
  if (connectionStatus === 'connected') return null;
  
  return (
    <>
      {/* Connection status alert */}
      {connectionStatus === 'error' && (
        <Alert variant="destructive" className="max-w-md mx-auto mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Issues</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Some backend services are currently unavailable. Basic functionality may still work.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkConnection}
              disabled={isRetrying}
              className="mt-2"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Checking connection...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry connection
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Offline mode indicator */}
      {connectionStatus === 'offline' && (
        <Alert variant="warning" className="max-w-md mx-auto mt-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Offline Mode</AlertTitle>
          <AlertDescription>
            Running in offline/local development mode. Some features requiring backend services will be limited.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
