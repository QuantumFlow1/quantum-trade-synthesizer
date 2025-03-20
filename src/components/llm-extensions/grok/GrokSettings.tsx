
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ServerCrash } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GrokSettingsProps {
  onClose: () => void;
}

export function GrokSettings({ onClose }: GrokSettingsProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium mb-2">Grok API Settings</h3>
      <div className="space-y-4">
        <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertDescription>
            API sleutels kunnen alleen worden geconfigureerd in het Admin Paneel.
            Neem contact op met uw systeembeheerder voor toegang.
          </AlertDescription>
        </Alert>
        
        <p className="text-sm text-gray-600">
          Grok API integratie komt binnenkort. Kom later terug voor updates.
        </p>
        
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} size="sm">
            Sluiten
          </Button>
        </div>
      </div>
    </div>
  );
}
