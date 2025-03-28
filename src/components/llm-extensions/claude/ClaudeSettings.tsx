
import { Button } from '@/components/ui/button';
import { X, ServerCrash } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClaudeSettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onClose: () => void;
}

export function ClaudeSettings({ onClose }: ClaudeSettingsProps) {
  const navigateToAdminPanel = () => {
    window.location.href = '/admin/api-keys';
  };
  
  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Claude Instellingen</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Sluiten</span>
        </Button>
      </div>

      <Alert variant="destructive">
        <ServerCrash className="h-4 w-4" />
        <AlertDescription>
          API sleutels kunnen alleen worden geconfigureerd in het Admin Paneel.
          Neem contact op met uw systeembeheerder voor toegang.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end space-x-2">
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
