
import { useState, useCallback } from 'react'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { createChatMessage, extractContextFromChat } from './utils/messageUtils'
import { toast } from '@/components/ui/use-toast'

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
  
  // Function to process audio with a callback for response generation
  const processAudio = async (audioUrl: string, responseCallback: (text: string) => Promise<void>) => {
    if (isProcessing) {
      console.log('Already processing audio, ignoring request')
      return
    }
    
    setIsProcessing(true)
    setProcessingError(null)
    
    try {
      // In a real implementation, this would transcribe the audio
      // For now, we'll just use a dummy transcription
      const transcription = "This is a simulated transcription of user audio input."
      setLastTranscription(transcription)
      setLastUserInput(transcription)
      
      // Add user message to chat history
      const userMessage = createChatMessage(transcription, 'user')
      setChatHistory(prev => [...prev, userMessage])
      
      // Call the callback to generate a response
      await responseCallback(transcription)
      
    } catch (error) {
      console.error('Error processing audio:', error)
      setProcessingError('Failed to process audio')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Function to process direct text input with a callback for response generation
  const processDirectText = async (text: string, responseCallback: (text: string) => Promise<void>) => {
    if (isProcessing || !text.trim()) {
      return
    }
    
    setIsProcessing(true)
    setProcessingError(null)
    
    try {
      setLastUserInput(text)
      
      // Add user message to chat history
      const userMessage = createChatMessage(text, 'user')
      setChatHistory(prev => [...prev, userMessage])
      
      // Call the callback to generate a response
      await responseCallback(text)
      
    } catch (error) {
      console.error('Error processing text:', error)
      setProcessingError('Failed to process text input')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Function to generate speech from text - modified to return Promise<void>
  const generateSpeech = async (text: string): Promise<boolean> => {
    try {
      // In a real implementation, this would call a text-to-speech API
      // For now, we'll just console.log the text
      console.log('Generating speech for:', text)
      
      // Simulate audio generation
      playAudio(text)
      
      return true
    } catch (error) {
      console.error('Error generating speech:', error)
      setProcessingError('Failed to generate speech')
      return false
    }
  }
  
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
    processAudio,
    processDirectText,
    generateSpeech,
    addAIResponseToChatHistory
  }
}
