
import { MessageSquare } from 'lucide-react';

export function ClaudeEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
      <MessageSquare className="h-16 w-16 text-green-400 mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">Claude AI Chat</h3>
      <p className="max-w-md">
        Start a conversation with Claude, an AI assistant developed by Anthropic.
        Claude is designed to be helpful, harmless, and honest.
      </p>
      <p className="mt-2 text-sm">
        You'll need to provide your Claude API key in the settings before you can start chatting.
      </p>
    </div>
  );
}
