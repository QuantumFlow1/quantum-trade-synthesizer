
import { ChatMessage } from '@/components/admin/types/chat-types'
import { createUserMessage, createAssistantMessage } from './messageUtils'
import { VoiceTemplate } from '@/lib/types'

/**
 * Handles web browsing requests with a standard response
 */
export const handleWebRequest = async (
  text: string,
  addMessageToChatHistory: (message: ChatMessage) => void,
  generateSpeech: (text: string) => Promise<void>,
  setIsProcessing: (isProcessing: boolean) => void
): Promise<void> => {
  console.log('Detected web browsing request, providing explanation response')
  
  // Create an explanation message
  const explanationResponse = "Ik kan geen externe websites openen of bezoeken. Als AI-assistent kan ik geen toegang krijgen tot internet links of webpagina's. Ik kan je wel helpen met trading informatie, analyse en educatie op basis van mijn training. Hoe kan ik je verder helpen met je trading vragen?"
  
  // Add user message to chat history
  const userMessage = createUserMessage(text)
  addMessageToChatHistory(userMessage)
  
  // Add AI explanation message to chat history
  const aiMessage = createAssistantMessage(explanationResponse)
  addMessageToChatHistory(aiMessage)
  
  // Generate speech for the explanation
  await generateSpeech(explanationResponse)
  setIsProcessing(false)
}
