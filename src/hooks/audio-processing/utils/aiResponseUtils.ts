
import { supabase } from "@/lib/supabase"
import { ChatMessage } from '@/components/admin/types/chat-types'

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

    // Add response to chat history
    addAIResponseToChatHistory(data.response)
    
    // Generate speech from response
    await generateSpeech(data.response)

  } catch (error) {
    console.error('Error in generateRegularAIResponse:', error)
    setProcessingError('An unexpected error occurred during AI response generation')
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

    // Add response to chat history
    addAIResponseToChatHistory(data.response)
    
    // Generate speech from response
    await generateSpeech(data.response)

  } catch (error) {
    console.error('Error in generateTradingAdvice:', error)
    setProcessingError('Failed to generate trading advice')
    // Attempt fallback to regular AI response
    await fallbackHandler(message)
  }
}
