
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendIcon, Bot, User, Loader2, ArrowLeft } from 'lucide-react'
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
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
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="mr-2 h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Grok Chat</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearChat}>
              Wis chat
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Terug
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Chat Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <Bot className="w-12 h-12 mb-4 opacity-20" />
              <p>Begin een gesprek met Grok AI.</p>
              <p className="text-sm mt-2">Stel een vraag door te typen en op Enter te drukken.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg px-4 py-2 max-w-[80%] flex ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-12' 
                      : 'bg-muted mr-12'
                  }`}
                >
                  <div className="mr-2 mt-1">
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="p-3 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Even geduld..." : "Typ je bericht..."}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              variant="default"
              size="icon"
              className={isLoading ? "animate-pulse" : ""}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
