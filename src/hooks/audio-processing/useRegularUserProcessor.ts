
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { useBaseAudioProcessor } from './useBaseAudioProcessor'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { useState, useCallback, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

interface RegularUserProcessorProps {
  selectedVoice: VoiceTemplate
  playAudio: (url: string) => void
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

export const useRegularUserProcessor = ({
  selectedVoice,
  playAudio,
  setChatHistory
}: RegularUserProcessorProps) => {
  const { toast } = useToast()
  const { user, userProfile } = useAuth()
  const [processingStage, setProcessingStage] = useState<string>('')
  
  // Track ongoing requests to prevent duplicates
  const pendingRequestRef = useRef<AbortController | null>(null)
  
  const {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    generateSpeech,
    processAudio: baseProcessAudio,
    processDirectText: baseProcessDirectText,
    addAIResponseToChatHistory,
    setProcessingError
  } = useBaseAudioProcessor({
    selectedVoice,
    playAudio,
    setChatHistory
  })

  // Memoized function to get user level - prevents unnecessary recalculations
  const getUserLevel = useCallback(() => {
    // Determine user level based on userProfile or default to beginner
    if (userProfile?.role === 'trader' || userProfile?.role === 'admin') {
      return 'advanced'
    }
    return 'beginner'
  }, [userProfile?.role])

  // Optimized function to generate AI response
  const generateRegularAIResponse = useCallback(async (userInput: string) => {
    try {
      setProcessingStage('Generating standard AI response')
      
      // Create a new abort controller for this request
      const controller = new AbortController()
      pendingRequestRef.current = controller
      
      // Fallback to regular AI response if trading advice fails
      const startTime = performance.now()
      // Remove the signal property from Supabase function options
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
        body: { prompt: userInput }
      })
      console.log(`AI response generated in ${performance.now() - startTime}ms`)

      // Check if this request was aborted or superseded
      if (controller.signal.aborted) {
        console.log('Request was aborted, not processing response')
        return
      }
      
      // Clear the pending request reference
      pendingRequestRef.current = null

      if (aiError) {
        console.error('Error generating AI response:', aiError)
        setProcessingError('Failed to generate AI response. Please try again.')
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
        toast({
          title: "AI Error",
          description: "No response received from AI service",
          variant: "destructive"
        })
        return
      }

      // Add AI response to chat history
      addAIResponseToChatHistory(aiResponse)

      // Convert AI response to speech
      await generateSpeech(aiResponse)
    } catch (error) {
      // Only handle errors if the request wasn't aborted
      if (error.name !== 'AbortError') {
        console.error('Error generating regular AI response:', error)
        setProcessingError('Failed to generate AI response. Please try again later.')
      } else {
        console.log('AI response request was aborted')
      }
    }
  }, [addAIResponseToChatHistory, generateSpeech, setProcessingError, setProcessingStage, toast])

  // Optimized user message processor with better abort control
  const processUserMessage = useCallback(async (message: string, previousMessages: any[] = []) => {
    try {
      // First abort any previous in-flight requests to avoid race conditions
      if (pendingRequestRef.current) {
        console.log('Aborting previous request')
        pendingRequestRef.current.abort()
      }
      
      // Create a new controller for this request
      const controller = new AbortController()
      pendingRequestRef.current = controller
      
      setProcessingStage('Generating trading advice')
      
      // Generate trading-specific advice
      const startTime = performance.now()
      // Remove the signal property from Supabase function options
      const { data: adviceData, error: adviceError } = await supabase.functions.invoke('generate-trading-advice', {
        body: { 
          message, 
          userId: user?.id,
          userLevel: getUserLevel(),
          previousMessages
        }
      })
      console.log(`Trading advice generated in ${performance.now() - startTime}ms`)

      // Check if this request was aborted
      if (controller.signal.aborted) {
        console.log('Request was aborted, not processing response')
        return
      }
      
      // Clear the pending request reference
      pendingRequestRef.current = null

      if (adviceError) {
        console.error('Error generating trading advice:', adviceError)
        setProcessingError('Failed to generate trading advice. Falling back to regular AI.')
        toast({
          title: "Trading Advice Error",
          description: "Falling back to standard AI response",
          variant: "destructive"
        })
        // Fall back to regular AI response
        await generateRegularAIResponse(message)
        return
      }

      const advice = adviceData?.advice
      if (!advice) {
        console.error('No advice returned from trading service')
        setProcessingError('No advice received. Falling back to regular AI.')
        await generateRegularAIResponse(message)
        return
      }

      // Add AI response to chat history
      addAIResponseToChatHistory(advice)

      // Convert AI response to speech
      await generateSpeech(advice)
      
      toast({
        title: "Success",
        description: "Trading advice generated successfully",
      })
    } catch (error) {
      // Only handle errors if the request wasn't aborted
      if (error.name !== 'AbortError') {
        console.error('Error processing user message:', error)
        setProcessingError('An error occurred. Falling back to regular AI.')
        // Fall back to regular AI response as a last resort
        await generateRegularAIResponse(message)
      } else {
        console.log('User message processing request was aborted')
      }
    }
  }, [user?.id, getUserLevel, generateRegularAIResponse, addAIResponseToChatHistory, generateSpeech, setProcessingError, setProcessingStage, toast])

  // Optimized process functions
  const processAudio = useCallback(async (audioUrl: string) => {
    await baseProcessAudio(audioUrl, processUserMessage)
  }, [baseProcessAudio, processUserMessage])

  const processDirectText = useCallback(async (text: string) => {
    await baseProcessDirectText(text, processUserMessage)
  }, [baseProcessDirectText, processUserMessage])

  return {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    processingStage,
    processAudio,
    processDirectText
  }
}
