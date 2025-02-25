
import { useRef, useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ArrowDownCircle } from 'lucide-react'
import { ChatMessage } from '../types/chat-types'

type ChatHistoryProps = {
  chatHistory: ChatMessage[]
}

export const ChatHistory = ({ chatHistory }: ChatHistoryProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollDown, setShowScrollDown] = useState(false)

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    if (chatContainerRef.current) {
      const scrollContainer = chatContainerRef.current
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [chatHistory])

  // Check scroll position to show/hide scroll to bottom button
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollDown(!isAtBottom)
    }
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  // Format the date for chat messages
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="relative">
      <ScrollArea 
        className="h-[300px] pr-4 mb-4 border rounded-md"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <div className="p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Start a conversation with EdriziAI
            </div>
          ) : (
            chatHistory.map((message) => (
              <div 
                key={message.id} 
                className={`flex flex-col ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      {/* Scroll to bottom button */}
      {showScrollDown && (
        <Button
          size="icon"
          variant="outline"
          onClick={scrollToBottom}
          className="absolute bottom-2 right-2 rounded-full z-10 bg-background shadow-md"
        >
          <ArrowDownCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
