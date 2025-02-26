
import { Bot } from 'lucide-react';

export function DeepSeekEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
      <Bot className="w-16 h-16 mb-6 opacity-20" />
      <p className="text-lg">Ask DeepSeek something</p>
      <p className="text-sm mt-2">Specialized in code and technical questions</p>
    </div>
  );
}
