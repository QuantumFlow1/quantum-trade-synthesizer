
import { useState } from 'react'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { supabase } from '@/lib/supabase'
import { VoiceTemplate } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

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

  // Common function to generate speech from text
  const generateSpeech = async (text: string) => {
    try {
      setProcessingError(null)
      const { data: speechData, error: speechError } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text, 
          voiceId: selectedVoice.id 
        }
      })

      if (speechError) {
        console.error('Error generating speech:', speechError)
        setProcessingError('Failed to generate speech. Please try again.')
        toast({
          title: "Error",
          description: "Failed to generate speech response",
          variant: "destructive",
        })
        return
      }

      const audioUrl = speechData?.audioUrl
      if (!audioUrl) {
        console.error('No audio URL returned from speech service')
        setProcessingError('No audio response received. Please try again.')
        toast({
          title: "Error",
          description: "No audio URL received from text-to-speech service",
          variant: "destructive",
        })
        return
      }

      // Play the generated audio
      playAudio(audioUrl)
    } catch (error) {
      console.error('Error in text-to-speech flow:', error)
      setProcessingError('An unexpected error occurred while generating speech.')
      toast({
        title: "Error",
        description: "Failed to process text-to-speech request",
        variant: "destructive",
      })
    }
  }

  // Function to handle audio processing
  const processAudio = async (audioUrl: string, processingFn: (transcription: string, previousMessages: any[]) => Promise<void>) => {
    if (!audioUrl) return

    setIsProcessing(true)
    setProcessingError(null)
    try {
      // First step: Process voice to get transcription
      toast({
        title: "Processing",
        description: "Transcribing your audio...",
      })
      
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('process-voice', {
        body: { audioUrl }
      })

      if (transcriptionError) {
        console.error('Error processing voice:', transcriptionError)
        setProcessingError('Failed to transcribe audio. Please try again.')
        toast({
          title: "Transcription Error",
          description: "Could not process your audio. Please try again.",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      const transcription = transcriptionData?.transcription
      if (!transcription) {
        console.error('No transcription returned from service')
        setProcessingError('No transcription could be generated from your audio.')
        toast({
          title: "Transcription Error",
          description: "No transcription returned. Please speak clearly and try again.",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      console.log('Got transcription:', transcription)
      setLastTranscription(transcription)
      setLastUserInput(transcription)
      
      // Add user message to chat history
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: transcription,
        timestamp: new Date()
      }
      
      setChatHistory(prev => [...prev, userMessage])

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
        title: "Processing",
        description: "Generating AI response...",
      })

      // Process with the provided function
      await processingFn(transcription, previousMessages)
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
  }

  // Function to handle direct text input
  const processDirectText = async (text: string, processingFn: (text: string, previousMessages: any[]) => Promise<void>) => {
    if (!text.trim()) return

    setIsProcessing(true)
    setProcessingError(null)
    setLastUserInput(text)

    try {
      // Add user message to chat history
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
      }
      
      setChatHistory(prev => [...prev, userMessage])

      toast({
        title: "Processing",
        description: "Generating response...",
      })

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

      // Process with the provided function
      await processingFn(text, previousMessages)
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
  }

  // Add an AI response to chat history
  const addAIResponseToChatHistory = (response: string) => {
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }
    
    setChatHistory(prev => [...prev, aiMessage])
  }

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
