
import { Zap } from 'lucide-react';

export function GrokEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
      <Zap className="w-16 h-16 mb-6 opacity-20" />
      <p className="text-lg">Chat with Grok</p>
      <p className="text-sm mt-2">Coming soon - Integration with Grok AI</p>
    </div>
  );
}
