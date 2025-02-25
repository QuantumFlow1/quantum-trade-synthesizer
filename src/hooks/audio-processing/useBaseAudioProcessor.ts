
import { useState, useCallback, useRef } from 'react'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { VoiceTemplate } from '@/lib/types'
import { generateSpeechFromText } from './utils/speechUtils'
import { transcribeAudio } from './utils/transcriptionUtils'
import { handleWebRequest } from './utils/webRequestHandler'

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

  // Helper to add user messages to chat history
  const addUserMessageToChatHistory = useCallback((message: string) => {
    setChatHistory(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date()
      }
    ])
  }, [setChatHistory])

  // Helper to add AI responses to chat history
  const addAIResponseToChatHistory = useCallback((response: string | ChatMessage) => {
    setChatHistory(prev => [
      ...prev,
      typeof response === 'string' 
        ? {
            id: Date.now().toString(),
            content: response,
            role: 'assistant',
            timestamp: new Date()
          }
        : response
    ])
  }, [setChatHistory])

  // Generate speech from text
  const generateSpeech = useCallback(async (text: string) => {
    try {
      console.log('Generating speech for text:', text.substring(0, 50) + '...')
      
      if (text.length === 0) {
        console.warn('Empty text passed to generateSpeech')
        return
      }
      
      const audioContent = await generateSpeechFromText(text, selectedVoice.id)
      
      if (!audioContent) {
        console.error('No audio content generated')
        return
      }
      
      // Play the audio
      playAudio(audioContent)
      
    } catch (error) {
      console.error('Error in generateSpeech:', error)
      setProcessingError('Failed to generate speech')
    }
  }, [playAudio, selectedVoice.id])

  // Process audio recording
  const processAudio = useCallback(async (
    audioUrl: string,
    messageProcessor: (message: string, previousMessages?: any[]) => Promise<void>
  ) => {
    if (!audioUrl) return
    
    setIsProcessing(true)
    setProcessingError(null)

    try {
      // Transcribe the audio
      const transcription = await transcribeAudio(audioUrl)
      
      if (!transcription) {
        throw new Error('Failed to transcribe audio')
      }
      
      console.log('Transcription received:', transcription)
      setLastTranscription(transcription)
      setLastUserInput(transcription)
      
      // Add user message to chat history
      addUserMessageToChatHistory(transcription)
      
      // Check if this is a web request
      const isWebRequest = handleWebRequest(transcription)
      
      if (!isWebRequest) {
        // Process the message
        await messageProcessor(transcription)
      }
      
    } catch (error) {
      console.error('Error processing audio:', error)
      setProcessingError('Failed to process audio recording')
    } finally {
      setIsProcessing(false)
    }
  }, [addUserMessageToChatHistory])

  // Process direct text input
  const processDirectText = useCallback(async (
    text: string,
    messageProcessor: (message: string, previousMessages?: any[]) => Promise<void>
  ) => {
    if (!text.trim()) return
    
    setIsProcessing(true)
    setProcessingError(null)
    setLastUserInput(text)

    try {
      // Add user message to chat history
      addUserMessageToChatHistory(text)
      
      // Check if this is a web request
      const isWebRequest = handleWebRequest(text)
      
      if (!isWebRequest) {
        // Process the message
        await messageProcessor(text)
      }
      
    } catch (error) {
      console.error('Error processing direct text:', error)
      setProcessingError('Failed to process your message')
    } finally {
      setIsProcessing(false)
    }
  }, [addUserMessageToChatHistory])

  return {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    generateSpeech,
    processAudio,
    processDirectText,
    addAIResponseToChatHistory,
    setProcessingError
  }
}
