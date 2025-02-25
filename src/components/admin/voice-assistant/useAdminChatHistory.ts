
import { useState, useEffect } from 'react'
import { ChatMessage } from '../types/chat-types'
import { createWelcomeMessage } from './WelcomeMessage'

export const useAdminChatHistory = (storageKey: string) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const savedHistory = localStorage.getItem(storageKey)
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        return parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      } catch (e) {
        console.error('Failed to parse chat history from localStorage:', e)
        return [createWelcomeMessage()]
      }
    }
    // Add a welcome message if no chat history
    return [createWelcomeMessage()]
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(chatHistory))
  }, [chatHistory, storageKey])
  
  return {
    chatHistory,
    setChatHistory
  }
}
