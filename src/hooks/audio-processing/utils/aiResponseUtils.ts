
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { createAssistantMessage } from './messageUtils'

/**
 * Generates a standard AI response
 */
export const generateRegularAIResponse = async (
  userInput: string,
  addMessageToChatHistory: (message: ChatMessage) => void,
  generateSpeech: (text: string) => Promise<void>,
  setProcessingError: (error: string | null) => void,
  controller: AbortController | null
): Promise<void> => {
  try {
    // Fallback to regular AI response if trading advice fails
    const startTime = performance.now()
    const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
      body: { prompt: userInput }
    })
    console.log(`AI response generated in ${performance.now() - startTime}ms`)

    // Check if this request was aborted or superseded
    if (controller?.signal.aborted) {
      console.log('Request was aborted, not processing response')
      return
    }

    if (aiError) {
      console.error('Error generating AI response:', aiError)
      setProcessingError('Failed to generate AI response. Please try again.')
      const { toast } = useToast()
      toast({
        title: "AI Error",
        description: "Failed to generate AI response",
        variant: "destructive"
      })
      return
    }

    const aiResponse = aiData?.response
    if (!aiResponse) {
      console.error('No response returned from AI service')
      setProcessingError('No response received from AI service.')
      const { toast } = useToast()
      toast({
        title: "AI Error",
        description: "No response received from AI service",
        variant: "destructive"
      })
      return
    }

    // Add AI response to chat history
    const aiMessage = createAssistantMessage(aiResponse)
    addMessageToChatHistory(aiMessage)

    // Convert AI response to speech
    await generateSpeech(aiResponse)
  } catch (error: any) {
    // Only handle errors if the request wasn't aborted
    if (error.name !== 'AbortError') {
      console.error('Error generating regular AI response:', error)
      setProcessingError('Failed to generate AI response. Please try again later.')
    } else {
      console.log('AI response request was aborted')
    }
  }
}

/**
 * Generates trading-specific advice
 */
export const generateTradingAdvice = async (
  message: string,
  userId: string | undefined,
  userLevel: string,
  previousMessages: any[],
  addMessageToChatHistory: (message: ChatMessage) => void,
  generateSpeech: (text: string) => Promise<void>,
  setProcessingError: (error: string | null) => void,
  generateRegularAIFallback: (message: string) => Promise<void>,
  controller: AbortController | null,
  setProcessingStage: (stage: string) => void
): Promise<void> => {
  try {
    setProcessingStage('Generating trading advice')
    
    // Generate trading-specific advice
    const startTime = performance.now()
    const { data: adviceData, error: adviceError } = await supabase.functions.invoke('generate-trading-advice', {
      body: { 
        message, 
        userId,
        userLevel,
        previousMessages
      }
    })
    console.log(`Trading advice generated in ${performance.now() - startTime}ms`)

    // Check if this request was aborted
    if (controller?.signal.aborted) {
      console.log('Request was aborted, not processing response')
      return
    }

    if (adviceError) {
      console.error('Error generating trading advice:', adviceError)
      setProcessingError('Failed to generate trading advice. Falling back to regular AI.')
      const { toast } = useToast()
      toast({
        title: "Trading Advice Error",
        description: "Falling back to standard AI response",
        variant: "destructive"
      })
      // Fall back to regular AI response
      await generateRegularAIFallback(message)
      return
    }

    const advice = adviceData?.advice
    if (!advice) {
      console.error('No advice returned from trading service')
      setProcessingError('No advice received. Falling back to regular AI.')
      await generateRegularAIFallback(message)
      return
    }

    // Add AI response to chat history
    const aiMessage = createAssistantMessage(advice)
    addMessageToChatHistory(aiMessage)

    // Convert AI response to speech
    await generateSpeech(advice)
    
    const { toast } = useToast()
    toast({
      title: "Success",
      description: "Trading advice generated successfully",
    })
  } catch (error: any) {
    // Only handle errors if the request wasn't aborted
    if (error.name !== 'AbortError') {
      console.error('Error processing user message:', error)
      setProcessingError('An error occurred. Falling back to regular AI.')
      // Fall back to regular AI response as a last resort
      await generateRegularAIFallback(message)
    } else {
      console.log('User message processing request was aborted')
    }
  }
}
