
import { ChatMessage } from '@/components/admin/types/chat-types'

/**
 * Function to preprocess user input to detect web requests
 */
export const preprocessUserInput = (input: string): { 
  isWebRequest: boolean, 
  processedInput: string 
} => {
  const webRelatedKeywords = [
    'http', 'www', 'website', 'link', 'open', 'browse', 'internet', 'url',
    'visit', 'webpagina', 'bekijk', 'bezoek', 'ga naar'
  ]
  
  // Check for web-related keywords
  const lowerInput = input.toLowerCase()
  const isWebRequest = webRelatedKeywords.some(keyword => lowerInput.includes(keyword))
  
  return {
    isWebRequest,
    processedInput: input
  }
}

/**
 * Creates a user message object for the chat history
 */
export const createUserMessage = (content: string): ChatMessage => {
  return {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date()
  }
}

/**
 * Creates an AI assistant message object for the chat history
 */
export const createAssistantMessage = (content: string): ChatMessage => {
  return {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content,
    timestamp: new Date()
  }
}
