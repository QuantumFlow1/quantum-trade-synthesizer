
import { supabase } from "@/lib/supabase"
import { ChatMessage } from '@/components/admin/types/chat-types'
import { handleAIResponseError } from "./errorHandlingUtils"

export const generateRegularAIResponse = async (
  userInput: string,
  addAIResponseToChatHistory: (response: string | ChatMessage) => void,
  generateSpeech: (text: string) => Promise<void>,
  setProcessingError: (error: string | null) => void,
  controller: AbortController
) => {
  try {
    console.log('Generating regular AI response for input:', userInput)
    
    const { data, error } = await supabase.functions.invoke('generate-ai-response', {
      body: { prompt: userInput }
    })

    if (error || !data?.response) {
      console.error('Error generating AI response:', error || 'No response data')
      setProcessingError('Failed to generate AI response')
      return
    }

    console.log('Received AI response:', data.response)
    
    // Add response to chat history
    if (typeof data.response === 'string') {
      addAIResponseToChatHistory({
        id: Date.now().toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      })
      
      // Generate speech from response
      await generateSpeech(data.response)
    } else {
      console.error('Invalid response format:', data.response)
      setProcessingError('Invalid response format received')
    }

  } catch (error) {
    handleAIResponseError(error, setProcessingError)
  }
}

export const generateTradingAdvice = async (
  message: string,
  userId: string | undefined,
  userLevel: string,
  previousMessages: any[],
  addAIResponseToChatHistory: (response: string | ChatMessage) => void,
  generateSpeech: (text: string) => Promise<void>,
  setProcessingError: (error: string | null) => void,
  fallbackHandler: (message: string) => Promise<void>,
  controller: AbortController,
  setProcessingStage: (stage: string) => void
) => {
  try {
    setProcessingStage('Generating trading advice')
    console.log('Generating trading advice for:', message)

    const { data, error } = await supabase.functions.invoke('generate-trading-advice', {
      body: { 
        message,
        userId,
        userLevel,
        previousMessages
      }
    })

    if (error) {
      console.error('Error generating trading advice:', error)
      throw error
    }

    if (!data?.response) {
      console.warn('No trading advice response, falling back to regular AI')
      await fallbackHandler(message)
      return
    }

    console.log('Received trading advice response:', data.response)
    
    // Add response to chat history
    if (typeof data.response === 'string') {
      addAIResponseToChatHistory({
        id: Date.now().toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      })
      
      // Generate speech from response
      await generateSpeech(data.response)
    } else {
      console.error('Invalid response format:', data.response)
      setProcessingError('Invalid response format received')
      await fallbackHandler(message)
    }

  } catch (error) {
    console.error('Error in generateTradingAdvice:', error)
    handleAIResponseError(error, setProcessingError)
    // Attempt fallback to regular AI response
    await fallbackHandler(message)
  }
}
