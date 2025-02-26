
import { CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Settings2, ArrowLeft, LayoutDashboard } from 'lucide-react'

interface GrokChatHeaderProps {
  onClearChat: () => void;
  onToggleSettings: () => void;
  onExit?: () => void;
  onToggleInterface?: () => void;
  modelName: string;
}

export function GrokChatHeader({ onClearChat, onToggleSettings, onExit, onToggleInterface, modelName = 'AI' }: GrokChatHeaderProps) {
  // Update the title display to show "Chat" after the model name
  const displayName = modelName ? `${modelName} Chat` : 'AI Chat';
  
  return (
    <CardHeader className="border-b py-4 px-6 flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        {onExit && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onExit}
            title="Verlaat chat"
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <CardTitle className="text-xl font-semibold">{displayName}</CardTitle>
      </div>
      <div className="flex gap-2">
        {onToggleInterface && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleInterface}
            title="Wissel tussen standaard en geavanceerde interface"
          >
            <LayoutDashboard className="h-5 w-5" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleSettings}
          title="AI Instellingen"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClearChat}
          title="Wis chat geschiedenis"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </CardHeader>
  )
}
