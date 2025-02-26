
import { MessageSquare } from 'lucide-react';

export function ClaudeEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
      <MessageSquare className="w-16 h-16 mb-6 opacity-20" />
      <p className="text-lg">Chat with Claude</p>
      <p className="text-sm mt-2">Coming soon - Integrate with Anthropic Claude</p>
    </div>
  );
}
