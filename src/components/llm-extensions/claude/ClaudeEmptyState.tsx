
import { MessageSquare } from 'lucide-react';

export function ClaudeEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
      <MessageSquare className="h-16 w-16 mb-4 text-green-500/20" />
      <h3 className="text-lg font-medium mb-2">Claude Chat</h3>
      <p className="mb-4">
        Start chatting with Claude, an AI assistant created by Anthropic.
      </p>
      <div className="text-sm space-y-2 max-w-md">
        <p>Try asking Claude about:</p>
        <ul className="space-y-1">
          <li>• Complex reasoning tasks</li>
          <li>• Creative writing and content generation</li>
          <li>• Detailed explanations of difficult concepts</li>
          <li>• Code assistance and debugging</li>
        </ul>
      </div>
    </div>
  );
}
