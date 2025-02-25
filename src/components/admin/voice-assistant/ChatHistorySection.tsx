
import { ChatHistory } from './ChatHistory'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { useEffect } from 'react'

export interface ChatHistorySectionProps {
  chatHistory: ChatMessage[]
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  storageKey: string
}

export const ChatHistorySection = ({ 
  chatHistory, 
  setChatHistory,
  storageKey 
}: ChatHistorySectionProps) => {
  
  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(storageKey)
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        if (Array.isArray(parsedHistory)) {
          setChatHistory(parsedHistory)
        }
      } catch (error) {
        console.error('Error parsing chat history:', error)
      }
    }
  }, [storageKey, setChatHistory])

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(chatHistory))
  }, [chatHistory, storageKey])

  return <ChatHistory chatHistory={chatHistory} />
}
