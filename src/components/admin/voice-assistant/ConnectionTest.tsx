
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface ConnectionTestProps {
  grok3Available: boolean;
  resetGrok3Connection: () => Promise<boolean>;
  onClose: () => void;
}

const ConnectionTest: React.FC<ConnectionTestProps> = ({
  grok3Available,
  resetGrok3Connection,
  onClose
}) => {
  const [isResetting, setIsResetting] = React.useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetGrok3Connection();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connection Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="font-medium">Grok3 API Connection:</div>
          {grok3Available ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-1" />
              <span>Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <XCircle className="h-5 w-5 mr-1" />
              <span>Not Connected</span>
            </div>
          )}
        </div>
        
        {!grok3Available && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
            Grok3 API connection is not available. Please check your API keys and try resetting the connection.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant="default"
          onClick={handleReset}
          disabled={isResetting}
        >
          {isResetting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Connection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectionTest;
