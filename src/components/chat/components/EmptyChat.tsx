
import React from 'react';
import { Bot } from 'lucide-react';

export function EmptyChat() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
      <Bot className="w-16 h-16 mb-6 opacity-20 animate-float" />
      <p className="text-lg fade-in">Begin een gesprek met AI.</p>
      <p className="text-sm mt-2 slide-up">Stel een vraag in het tekstvak hieronder.</p>
    </div>
  );
}
