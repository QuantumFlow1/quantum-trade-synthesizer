
import React from 'react';
import { Sparkles } from 'lucide-react';

export const ChatEmpty: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
      <Sparkles className="w-16 h-16 mb-6 opacity-20" />
      <p className="text-lg">Chat with OpenAI</p>
      <p className="text-sm mt-2">Coming soon - Integrate with GPT models</p>
    </div>
  );
};
