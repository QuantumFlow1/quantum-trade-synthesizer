
import { useState } from 'react'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { VoiceTemplate } from '@/lib/types'
import { useBaseAudioProcessor } from './useBaseAudioProcessor'
import { createChatMessage } from './utils/messageUtils'

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
  const [processingStage, setProcessingStage] = useState<string>('')
  
  // Use our base audio processor for common functionality
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

  // Function to generate a standard AI response
  const generateStandardAIResponse = async (userInput: string, context: ChatMessage[]) => {
    try {
      setProcessingStage('Generating standard AI response')
      console.log('Generating standard AI response for input:', userInput)
      
      // For now, we'll use a simple fixed response
      // In a real system, this would call an AI API
      const fixedResponse = "I'm your regular AI assistant. I can help answer your questions about trading and investments. How can I assist you today?"
      
      // Add the response to chat history
      addAIResponseToChatHistory(fixedResponse)
      
      // Generate speech for the response
      setProcessingStage('Converting standard AI response to speech')
      await generateSpeech(fixedResponse)
      
    } catch (error) {
      console.error('Error in generateStandardAIResponse:', error)
      setProcessingError('Failed to generate an AI response')
    }
  }

  // Wrapper function to process audio with standard AI
  const processAudio = async (audioUrl: string) => {
    await baseProcessAudio(audioUrl, async (text) => {
      await generateStandardAIResponse(text, [])
    })
  }

  // Wrapper function to process direct text input with standard AI
  const processDirectText = async (text: string) => {
    await baseProcessDirectText(text, async (text) => {
      await generateStandardAIResponse(text, [])
    })
  }

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
