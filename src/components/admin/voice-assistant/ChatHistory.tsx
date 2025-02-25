
import { ChatMessage } from '../types/chat-types'
import { Avatar } from '@/components/ui/avatar'
import { Bot, User } from 'lucide-react'
import { useEffect, useRef } from 'react'

type ChatHistoryProps = {
  chatHistory: ChatMessage[]
}

export const ChatHistory = ({ chatHistory }: ChatHistoryProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory])

  return (
    <div className="flex flex-col space-y-4 h-60 overflow-y-auto p-2 border rounded-md">
      {chatHistory.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">No chat history yet.</p>
        </div>
      ) : (
        <>
          {chatHistory.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  <p className="text-sm font-medium">
                    {message.role === 'user' ? 'You' : 'Edrizi AI'}
                  </p>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}
