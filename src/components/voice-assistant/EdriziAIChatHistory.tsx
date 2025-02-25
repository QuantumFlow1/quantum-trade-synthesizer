
import { useEffect, useRef } from 'react'
import { Bot, User } from 'lucide-react'

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type EdriziAIChatHistoryProps = {
  chatHistory: ChatMessage[];
}

export const EdriziAIChatHistory = ({ chatHistory }: EdriziAIChatHistoryProps) => {
  const chatBoxRef = useRef<HTMLDivElement | null>(null)

  // Scroll to the bottom of the chat when the chat history changes
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [chatHistory])

  if (chatHistory.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
        <Bot className="w-12 h-12 mb-4 opacity-20" />
        <p>
          Welkom bij de Edrizi AI Assistant!<br/>
          Ik ben hier om al je vragen te beantwoorden.
        </p>
        <p className="text-sm mt-2">
          Begin een gesprek door te typen of op de microfoonknop te klikken.
        </p>
      </div>
    )
  }

  return (
    <div 
      ref={chatBoxRef}
      className="h-full overflow-y-auto pr-2 space-y-4"
    >
      {chatHistory.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`rounded-lg px-4 py-2 max-w-[80%] flex ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground ml-12' 
                : 'bg-muted mr-12'
            }`}
          >
            <div className="mr-2 mt-1">
              {message.sender === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div>
              <p className="whitespace-pre-line text-sm">{message.text}</p>
              <p className="text-xs opacity-50 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
