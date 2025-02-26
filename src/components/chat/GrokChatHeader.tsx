
import { Bot, ArrowLeft, Trash2, Settings2 } from 'lucide-react'
import { CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'

interface GrokChatHeaderProps {
  onClearChat: () => void;
  onToggleSettings: () => void;
}

export function GrokChatHeader({ onClearChat, onToggleSettings }: GrokChatHeaderProps) {
  const handleClearChat = () => {
    onClearChat();
    toast({
      title: "Chat geschiedenis gewist",
      description: "Alle berichten zijn verwijderd."
    });
  };

  return (
    <CardHeader className="border-b px-6 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bot className="mr-3 h-6 w-6" />
          <h2 className="text-xl font-semibold">Grok Chat</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleSettings}
            className="text-white border-white hover:bg-white/20 hover:text-white"
            title="Grok instellingen"
          >
            <Settings2 className="h-4 w-4 mr-1" />
            Instellingen
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearChat}
            className="text-white border-white hover:bg-white/20 hover:text-white"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Wis chat
          </Button>
          <Link to="/">
            <Button 
              variant="outline" 
              size="sm"
              className="text-white border-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Terug
            </Button>
          </Link>
        </div>
      </div>
    </CardHeader>
  );
}
