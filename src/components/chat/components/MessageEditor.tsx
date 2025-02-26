
import React from 'react';
import { Button } from '@/components/ui/button';

interface MessageEditorProps {
  editingContent: string;
  setEditingContent: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function MessageEditor({
  editingContent,
  setEditingContent,
  onSave,
  onCancel
}: MessageEditorProps) {
  return (
    <div className="space-y-2">
      <textarea
        value={editingContent}
        onChange={(e) => setEditingContent(e.target.value)}
        className="w-full p-2 bg-background border rounded-md text-foreground"
        rows={4}
      />
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          className="text-xs"
        >
          Cancel
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={onSave}
          className="text-xs"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
