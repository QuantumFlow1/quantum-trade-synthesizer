
import { MessageSquare } from 'lucide-react';

export function ClaudeEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
      <MessageSquare className="w-16 h-16 mb-6 opacity-20 animate-pulse" />
      <p className="text-lg font-medium">Welcome to Claude Chat</p>
      <p className="text-sm mt-2">Ask a question to start a conversation with Claude.</p>
    </div>
  );
}
