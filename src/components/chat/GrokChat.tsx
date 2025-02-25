
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SendIcon, Bot, User, Loader2, ArrowLeft, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function GrokChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check API availability on mount
  useEffect(() => {
    checkGrokAvailability()
  }, [])

  // Function to check if Grok API is available
  const checkGrokAvailability = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { service: 'grok3' }
      })
      
      if (error || !data?.available) {
        toast({
          title: "Grok API Status",
          description: "De Grok API is momenteel niet beschikbaar. Sommige functies werken mogelijk niet.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error checking Grok API:', error)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem('grokChatHistory')
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(messagesWithDateObjects)
      } catch (error) {
        console.error('Error parsing saved chat history:', error)
      }
    }
  }, [])

  // Save chat history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('grokChatHistory', JSON.stringify(messages))
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    // Create and add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      console.log('Calling Grok3 API via Edge Function...')
      
      // Create conversation history in the format expected by Grok API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { 
          message: inputMessage,
          context: conversationHistory
        }
      })
      
      if (error) {
        console.error('Error calling Grok3 API:', error)
        throw new Error(`API error: ${error.message}`)
      }
      
      if (!data || !data.response) {
        throw new Error('Invalid response from Grok3 API')
      }
      
      console.log('Grok3 response received:', data)
      
      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // Show success toast
      toast({
        title: "Antwoord ontvangen",
        description: "Grok heeft je vraag beantwoord.",
      })
    } catch (error) {
      console.error('Error in chat process:', error)
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Er is een fout opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
      
      // Show error toast
      toast({
        title: "Er is een fout opgetreden",
        description: "Kon geen verbinding maken met de Grok API. Controleer je internetverbinding en probeer het opnieuw.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('grokChatHistory')
    toast({
      title: "Chat geschiedenis gewist",
      description: "Alle berichten zijn verwijderd."
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white">
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
              onClick={clearChat}
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
      
      <CardContent className="p-0 flex flex-col h-[600px]">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <Bot className="w-16 h-16 mb-6 opacity-20" />
              <p className="text-lg">Begin een gesprek met Grok AI.</p>
              <p className="text-sm mt-2">Stel een vraag in het tekstvak hieronder.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg px-5 py-3 max-w-[85%] flex ${
                    message.role === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className={`mr-3 mt-1 ${message.role === 'user' ? 'text-white' : 'text-indigo-600'}`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString()} - {message.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Even geduld..." : "Typ je bericht... (Enter om te versturen)"}
              disabled={isLoading}
              className="flex-1 min-h-[60px] resize-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              variant="default"
              size="icon"
              className={`bg-indigo-600 hover:bg-indigo-700 h-[60px] w-[60px] ${isLoading ? "animate-pulse" : ""}`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
