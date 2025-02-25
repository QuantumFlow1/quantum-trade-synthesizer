
import { useState, useCallback } from 'react'
import { transcribeAudio } from './utils/transcriptionUtils'
import { generateSpeechFromText } from './utils/speechUtils'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { createChatMessage, extractContextFromChat } from './utils/messageUtils'
import { toast } from '@/components/ui/use-toast'
import { handleTranscriptionError, handleAIResponseError } from './utils/errorHandlingUtils'

interface BaseAudioProcessorProps {
  selectedVoice: VoiceTemplate
  playAudio: (url: string) => void
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

export const useBaseAudioProcessor = ({ 
  selectedVoice, 
  playAudio, 
  setChatHistory 
}: BaseAudioProcessorProps) => {
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [lastUserInput, setLastUserInput] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  
  // Generic function to add AI response to chat history
  const addAIResponseToChatHistory = useCallback((response: string | ChatMessage) => {
    setChatHistory(prevHistory => {
      // Check if the response is already a ChatMessage or just a string
      const message = typeof response === 'string' 
        ? createChatMessage(response, 'assistant')
        : response
      return [...prevHistory, message]
    })
  }, [setChatHistory])

  return {
    lastTranscription,
    setLastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    setIsProcessing,
    processingError,
    setProcessingError,
    addAIResponseToChatHistory
  }
}
