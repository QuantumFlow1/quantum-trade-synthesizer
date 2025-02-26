
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  setShowSettings: (show: boolean) => void;
  showSettings: boolean;
  clearChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  setShowSettings,
  showSettings,
  clearChat
}) => {
  return (
    <>
      <CardTitle className="text-lg font-medium flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
        OpenAI Chat
      </CardTitle>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearChat}
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
