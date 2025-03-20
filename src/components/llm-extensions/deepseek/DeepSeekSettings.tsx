
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ServerCrash } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DeepSeekSettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onClose: () => void;
}

export function DeepSeekSettings({ apiKey, setApiKey, onClose }: DeepSeekSettingsProps) {
  const navigateToAdminPanel = () => {
    window.location.href = '/admin/api-keys';
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">DeepSeek Settings</h3>
      
      <Alert variant="destructive">
        <ServerCrash className="h-4 w-4" />
        <AlertDescription>
          API sleutels kunnen alleen worden geconfigureerd in het Admin Paneel.
          Neem contact op met uw systeembeheerder voor toegang.
        </AlertDescription>
      </Alert>
      
      <div className="text-sm text-muted-foreground">
        <p>DeepSeek is een AI-assistent gefocust op programmeren en technische taken.</p>
        <p>API sleutels zijn nodig voor toegang tot DeepSeek functionaliteit.</p>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onClose}>
          Sluiten
        </Button>
        <Button onClick={navigateToAdminPanel}>
          Naar Admin Paneel
        </Button>
      </div>
    </div>
  );
}
