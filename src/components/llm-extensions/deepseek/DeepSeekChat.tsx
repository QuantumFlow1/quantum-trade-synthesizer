
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu } from 'lucide-react';

export function DeepSeekChat() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
      <Cpu className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-700">DeepSeek Chat</h3>
      <p className="text-gray-500 text-center mt-2">
        Chat interface for DeepSeek is ready for connection.
      </p>
      <p className="text-xs text-gray-400 mt-6">
        Use the API key settings to configure your connection.
      </p>
    </div>
  );
}
