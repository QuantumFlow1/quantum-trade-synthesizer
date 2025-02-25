
import { useAuth } from '@/components/auth/AuthProvider'
import { useBaseAudioProcessor } from './useBaseAudioProcessor'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { useState, useCallback, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { generateRegularAIResponse, generateTradingAdvice } from './utils/aiResponseUtils'
import { getUserLevel } from './utils/userUtils'

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

  // Optimized function to generate AI response, extracted to utility
  const generateRegularAIResponseHandler = useCallback(async (userInput: string) => {
    try {
      setProcessingStage('Generating standard AI response')
      
      // Create a new abort controller for this request
      const controller = new AbortController()
      pendingRequestRef.current = controller
      
      await generateRegularAIResponse(
        userInput,
        addAIResponseToChatHistory,
        generateSpeech,
        setProcessingError,
        controller
      )

      // Clear the pending request reference
      pendingRequestRef.current = null
    } catch (error) {
      console.error('Error in AI response handler:', error)
      setProcessingError('An unexpected error occurred.')
    }
  }, [addAIResponseToChatHistory, generateSpeech, setProcessingError, setProcessingStage])

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
      
      console.log('Processing user message:', message)
      
      await generateTradingAdvice(
        message,
        user?.id,
        getUserLevel(userProfile),
        previousMessages,
        addAIResponseToChatHistory,
        generateSpeech,
        setProcessingError,
        generateRegularAIResponseHandler,
        controller,
        setProcessingStage
      )
      
      // Clear the pending request reference if not already cleared
      if (pendingRequestRef.current === controller) {
        pendingRequestRef.current = null
      }
    } catch (error) {
      console.error('Error in processUserMessage:', error)
      setProcessingError('An unexpected error occurred during processing.')
      
      // Attempt to recover with regular AI response
      await generateRegularAIResponseHandler(message)
    }
  }, [
    user?.id, 
    userProfile, 
    generateRegularAIResponseHandler,
    addAIResponseToChatHistory,
    generateSpeech,
    setProcessingError,
    setProcessingStage
  ])

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
