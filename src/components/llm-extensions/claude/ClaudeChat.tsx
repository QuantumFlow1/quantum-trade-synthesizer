
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export function ClaudeChat() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
      <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-700">Claude Chat</h3>
      <p className="text-gray-500 text-center mt-2">
        Chat interface for Claude is ready for connection.
      </p>
      <p className="text-xs text-gray-400 mt-6">
        Use the API key settings to configure your connection.
      </p>
    </div>
  );
}
