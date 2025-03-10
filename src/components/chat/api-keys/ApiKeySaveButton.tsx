
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Key } from 'lucide-react';

interface ApiKeySaveButtonProps {
  isSaving: boolean;
  onSave: () => void;
}

export const ApiKeySaveButton = ({ isSaving, onSave }: ApiKeySaveButtonProps) => {
  return (
    <DialogFooter>
      <Button 
        type="submit" 
        onClick={onSave} 
        disabled={isSaving}
        className="w-full mt-4"
      >
        {isSaving ? (
          <>
            <span className="mr-2">Saving...</span>
          </>
        ) : (
          <>
            <Key className="mr-2 h-4 w-4" />
            Save API Key
          </>
        )}
      </Button>
    </DialogFooter>
  );
};
