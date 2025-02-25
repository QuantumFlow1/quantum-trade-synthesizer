
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { ChatHistory } from './ChatHistory'
import { ChatMessage } from '../types/chat-types'
import { createWelcomeMessage } from './WelcomeMessage'

type ChatHistorySectionProps = {
  chatHistory: ChatMessage[]
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  storageKey: string
}

export const ChatHistorySection = ({ 
  chatHistory, 
  setChatHistory,
  storageKey
}: ChatHistorySectionProps) => {
  const clearChatHistory = () => {
    setChatHistory([createWelcomeMessage()])
    localStorage.removeItem(storageKey)
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Chat History</h3>
        {chatHistory.length > 1 && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={clearChatHistory}
            className="h-8"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <ChatHistory chatHistory={chatHistory} />
    </div>
  )
}
