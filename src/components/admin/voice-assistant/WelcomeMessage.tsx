
import { ChatMessage } from '../types/chat-types'

export const createWelcomeMessage = (): ChatMessage => {
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: "Welcome to the EdriziAI Super Admin Assistant. I'm here to provide comprehensive insights and support for your advanced requirements. How can I assist you today?",
    timestamp: new Date()
  }
}
