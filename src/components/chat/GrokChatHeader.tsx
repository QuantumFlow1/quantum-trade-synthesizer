
import { CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Settings2, ArrowLeft } from 'lucide-react'

interface GrokChatHeaderProps {
  onClearChat: () => void;
  onToggleSettings: () => void;
  onExit?: () => void;
  modelName: string;
}

export function GrokChatHeader({ onClearChat, onToggleSettings, onExit, modelName = 'AI' }: GrokChatHeaderProps) {
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
        <CardTitle className="text-xl font-semibold">{modelName} Chat</CardTitle>
      </div>
      <div className="flex gap-2">
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
