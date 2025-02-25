
import { useState, useCallback } from 'react'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { VoiceTemplate } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { preprocessUserInput, createUserMessage } from './utils/messageUtils'
import { generateSpeechFromText } from './utils/speechUtils'
import { handleWebRequest } from './utils/webRequestHandler'
import { transcribeAudio } from './utils/transcriptionUtils'

interface BaseAudioProcessorProps {
  selectedVoice: VoiceTemplate
  playAudio: (url: string) => void
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

export const useBaseAudioProcessor = ({ 
  selectedVoice, 
  playAudio, 
  setChatHistory,
}: BaseAudioProcessorProps) => {
  const { toast } = useToast()
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [lastUserInput, setLastUserInput] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [processingStage, setProcessingStage] = useState<string>('')

  // Optimized function to add messages to chat history - reduces rerenders
  const addMessageToChatHistory = useCallback((message: ChatMessage) => {
    setChatHistory(prev => [...prev, message])
  }, [setChatHistory])

  // Optimized function to generate speech from text
  const generateSpeech = useCallback(async (text: string) => {
    return generateSpeechFromText(
      text, 
      selectedVoice, 
      playAudio, 
      setProcessingStage, 
      setProcessingError
    )
  }, [selectedVoice, playAudio])

  // Function to handle audio processing with optimizations for responsiveness
  const processAudio = useCallback(async (audioUrl: string, processingFn: (transcription: string, previousMessages: any[]) => Promise<void>) => {
    if (!audioUrl) return

    setIsProcessing(true)
    setProcessingError(null)
    setProcessingStage('Transcribing audio')
    
    try {
      // Transcribe the audio
      const transcription = await transcribeAudio(
        audioUrl,
        setProcessingStage,
        setProcessingError
      )
      
      if (!transcription) {
        setIsProcessing(false)
        return
      }
      
      setLastTranscription(transcription)
      setLastUserInput(transcription)
      
      // Add user message to chat history
      const userMessage = createUserMessage(transcription)
      addMessageToChatHistory(userMessage)

      // Check if this is a web browsing request
      const { isWebRequest, processedInput } = preprocessUserInput(transcription)
      
      if (isWebRequest) {
        await handleWebRequest(transcription, addMessageToChatHistory, generateSpeech, setIsProcessing)
        return
      }

      // Get previous messages for context
      let previousMessages: any[] = []
      setChatHistory(prev => {
        // Take the last 10 messages
        previousMessages = prev.slice(-10).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
        return prev
      })

      toast({
        title: "Verwerken",
        description: "AI-antwoord wordt gegenereerd...",
      })

      // Process with the provided function
      setProcessingStage('Generating AI response')
      await processingFn(processedInput, previousMessages)
    } catch (error) {
      console.error('Error in audio processing flow:', error)
      setProcessingError('An unexpected error occurred during audio processing.')
      toast({
        title: "Processing Error",
        description: "Failed to process your request. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [toast, addMessageToChatHistory, generateSpeech])

  // Function to handle direct text input with optimizations
  const processDirectText = useCallback(async (text: string, processingFn: (text: string, previousMessages: any[]) => Promise<void>) => {
    if (!text.trim()) return

    setIsProcessing(true)
    setProcessingStage('Processing text input')
    setProcessingError(null)
    setLastUserInput(text)

    try {
      // Check if this is a web browsing request
      const { isWebRequest, processedInput } = preprocessUserInput(text)
      
      // Add user message to chat history
      const userMessage = createUserMessage(text)
      addMessageToChatHistory(userMessage)

      if (isWebRequest) {
        await handleWebRequest(text, addMessageToChatHistory, generateSpeech, setIsProcessing)
        return
      }

      toast({
        title: "Verwerken",
        description: "Antwoord wordt gegenereerd...",
      })

      // Get previous messages for context - optimized to reduce state changes
      let previousMessages: any[] = []
      setChatHistory(prev => {
        // Take the last 10 messages
        previousMessages = prev.slice(-10).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
        return prev
      })

      // Process with the provided function
      setProcessingStage('Generating AI response')
      await processingFn(processedInput, previousMessages)
    } catch (error) {
      console.error('Error processing direct text:', error)
      setProcessingError('Failed to process your message. Please try again.')
      toast({
        title: "Processing Error",
        description: "An error occurred while processing your message",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [toast, addMessageToChatHistory, generateSpeech])

  // Add an AI response to chat history
  const addAIResponseToChatHistory = useCallback((response: string) => {
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }
    
    addMessageToChatHistory(aiMessage)
  }, [addMessageToChatHistory])

  return {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    processingStage,
    generateSpeech,
    processAudio,
    processDirectText,
    addAIResponseToChatHistory,
    setProcessingError
  }
}
