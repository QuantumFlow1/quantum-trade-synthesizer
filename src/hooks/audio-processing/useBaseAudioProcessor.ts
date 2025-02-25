
import { useState, useCallback } from 'react'
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
  const [processingStage, setProcessingStage] = useState<string>('')

  // Optimized function to check for web browsing requests
  const preprocessUserInput = useCallback((input: string): { 
    isWebRequest: boolean, 
    processedInput: string 
  } => {
    const webRelatedKeywords = [
      'http', 'www', 'website', 'link', 'open', 'browse', 'internet', 'url',
      'visit', 'webpagina', 'bekijk', 'bezoek', 'ga naar'
    ]
    
    // Check for web-related keywords
    const lowerInput = input.toLowerCase()
    const isWebRequest = webRelatedKeywords.some(keyword => lowerInput.includes(keyword))
    
    return {
      isWebRequest,
      processedInput: input
    }
  }, [])

  // Optimized function to add messages to chat history - reduces rerenders
  const addMessageToChatHistory = useCallback((message: ChatMessage) => {
    setChatHistory(prev => [...prev, message])
  }, [setChatHistory])

  // Handle web requests consistently and efficiently
  const handleWebRequest = useCallback(async (text: string) => {
    console.log('Detected web browsing request, providing explanation response')
    
    // Create an explanation message
    const explanationResponse = "Ik kan geen externe websites openen of bezoeken. Als AI-assistent kan ik geen toegang krijgen tot internet links of webpagina's. Ik kan je wel helpen met trading informatie, analyse en educatie op basis van mijn training. Hoe kan ik je verder helpen met je trading vragen?"
    
    // Add user message to chat history
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }
    addMessageToChatHistory(userMessage)
    
    // Add AI explanation message to chat history
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: explanationResponse,
      timestamp: new Date()
    }
    addMessageToChatHistory(aiMessage)
    
    // Generate speech for the explanation
    await generateSpeech(explanationResponse)
    setIsProcessing(false)
  }, [addMessageToChatHistory])

  // Optimized function to generate speech from text
  const generateSpeech = useCallback(async (text: string) => {
    try {
      console.log('Starting speech generation with text:', text.substring(0, 100) + '...')
      setProcessingStage('Converting to speech')
      setProcessingError(null)
      
      // Create a controller for fetch request - will enable cancellation later if needed
      const controller = new AbortController()
      const signal = controller.signal
      
      // More detailed request logging
      console.log('Sending request to text-to-speech function with voice ID:', selectedVoice.id)
      
      const startTime = performance.now()
      const { data: speechData, error: speechError } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text, 
          voiceId: selectedVoice.id 
        },
        signal
      })
      const requestTime = performance.now() - startTime
      console.log(`TTS request completed in ${requestTime.toFixed(0)}ms`)

      if (speechError) {
        console.error('Error from text-to-speech function:', speechError)
        setProcessingError('Failed to generate speech. Please try again.')
        toast({
          title: "Speech Generation Error",
          description: "Failed to generate speech response. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Verify we have the audioContent in the response
      if (!speechData?.audioContent) {
        console.error('No audioContent in response:', speechData)
        setProcessingError('No audio response received. Please try again.')
        toast({
          title: "Speech Generation Error",
          description: "No audio content received from speech service. Please try again.",
          variant: "destructive",
        })
        return
      }

      console.log('Received audioContent, converting to URL')
      
      // Convert the base64 audio content to a playable URL - optimized for performance
      try {
        const audioBlob = await fetch(`data:audio/mp3;base64,${speechData.audioContent}`).then(r => r.blob())
        const audioUrl = URL.createObjectURL(audioBlob)
        
        // Play the generated audio
        console.log('Playing audio with URL:', audioUrl)
        playAudio(audioUrl)
      } catch (conversionError) {
        console.error('Error converting audio content to URL:', conversionError)
        setProcessingError('Error processing audio data. Please try again.')
        toast({
          title: "Audio Processing Error",
          description: "Failed to process audio data. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Unexpected error in text-to-speech flow:', error)
      setProcessingError('An unexpected error occurred while generating speech.')
      toast({
        title: "Speech Generation Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    }
  }, [selectedVoice.id, playAudio, toast])

  // Function to handle audio processing with optimizations for responsiveness
  const processAudio = useCallback(async (audioUrl: string, processingFn: (transcription: string, previousMessages: any[]) => Promise<void>) => {
    if (!audioUrl) return

    setIsProcessing(true)
    setProcessingError(null)
    setProcessingStage('Transcribing audio')
    
    try {
      // Show immediate feedback to user
      toast({
        title: "Verwerken",
        description: "Audio wordt getranscribeerd...",
      })
      
      // First step: Process voice to get transcription
      console.log('Starting audio transcription')
      
      const startTranscribeTime = performance.now()
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('process-voice', {
        body: { audioUrl }
      })
      const transcribeTime = performance.now() - startTranscribeTime
      console.log(`Transcription completed in ${transcribeTime.toFixed(0)}ms`)

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
        console.error('No transcription returned from service:', transcriptionData)
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
      
      addMessageToChatHistory(userMessage)

      // Check if this is a web browsing request
      const { isWebRequest, processedInput } = preprocessUserInput(transcription)
      
      if (isWebRequest) {
        await handleWebRequest(transcription)
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
  }, [toast, preprocessUserInput, addMessageToChatHistory, handleWebRequest])

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
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
      }
      
      addMessageToChatHistory(userMessage)

      if (isWebRequest) {
        await handleWebRequest(text)
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
  }, [preprocessUserInput, addMessageToChatHistory, handleWebRequest, toast])

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
