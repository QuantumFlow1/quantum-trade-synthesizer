
import { supabase } from '@/lib/supabase'
import { useBaseAudioProcessor } from './useBaseAudioProcessor'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

interface SuperAdminProcessorProps {
  selectedVoice: VoiceTemplate
  playAudio: (url: string) => void
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

export const useSuperAdminProcessor = ({
  selectedVoice,
  playAudio,
  setChatHistory
}: SuperAdminProcessorProps) => {
  const { toast } = useToast()
  const [processingStage, setProcessingStage] = useState<string>('')
  const [grok3Available, setGrok3Available] = useState<boolean>(true)
  const [retryCount, setRetryCount] = useState<number>(0)
  const [lastRetryTime, setLastRetryTime] = useState<number>(0)
  const MAX_RETRIES = 3
  const RETRY_COOLDOWN = 60000 // 1 minute cooldown between retry attempts
  
  // Check Grok3 API availability on mount
  useEffect(() => {
    checkGrok3Availability()
  }, [])
  
  // Function to check if Grok3 API is available
  const checkGrok3Availability = useCallback(async () => {
    try {
      console.log('Checking Grok3 API availability...')
      
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "system: ping test", context: [] }
      })
      
      if (error) {
        console.error('Grok3 API check failed:', error)
        setGrok3Available(false)
        toast({
          title: "Grok3 API Niet Beschikbaar",
          description: "Schakel over naar standaard AI. Controleer je API-sleutel in Supabase.",
          variant: "destructive"
        })
        return false
      } else if (data?.response === "pong" && data?.status === "available") {
        console.log('Grok3 API is available')
        setGrok3Available(true)
        setRetryCount(0) // Reset retry count on successful connection
        return true
      } else {
        console.warn('Unexpected response from Grok3 API check:', data)
        setGrok3Available(false)
        toast({
          title: "Grok3 API Niet Beschikbaar",
          description: "Onverwachte respons. Schakel over naar standaard AI.",
          variant: "destructive"
        })
        return false
      }
    } catch (error) {
      console.error('Error checking Grok3 API:', error)
      setGrok3Available(false)
      toast({
        title: "Grok3 API Fout",
        description: "Kon niet verbinden met Grok3 API. Schakel over naar standaard AI.",
        variant: "destructive"
      })
      return false
    }
  }, [toast])
  
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

  const generateRegularAIResponse = async (userInput: string) => {
    try {
      setProcessingStage('Genereren standaard AI-antwoord')
      
      // Fallback to regular AI response
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
        body: { prompt: userInput }
      })

      if (aiError) {
        console.error('Error generating AI response:', aiError)
        setProcessingError('Failed to generate AI response.')
        toast({
          title: "AI Fout",
          description: "Kon geen AI-antwoord genereren",
          variant: "destructive"
        })
        return
      }

      const aiResponse = aiData?.response
      if (!aiResponse) {
        console.error('No response returned from AI service')
        setProcessingError('No response received from AI service.')
        return
      }

      // Add AI response to chat history
      addAIResponseToChatHistory(aiResponse)

      // Convert AI response to speech
      await generateSpeech(aiResponse)
    } catch (error) {
      console.error('Error generating regular AI response:', error)
      setProcessingError('Failed to generate AI response. Please try again later.')
    }
  }

  const generateGrok3Response = async (userInput: string, context: any[] = []) => {
    try {
      // Check Grok3 availability before proceeding
      const isGrok3Available = await checkGrok3Availability()
      
      // If Grok3 is known to be unavailable and we're not due for a retry, skip directly to fallback
      if (!isGrok3Available) {
        const currentTime = Date.now()
        const shouldRetry = lastRetryTime === 0 || (currentTime - lastRetryTime > RETRY_COOLDOWN)
        
        if (retryCount >= MAX_RETRIES && !shouldRetry) {
          console.log('Skipping Grok3 API due to previous failures, using fallback directly')
          await generateRegularAIResponse(userInput)
          return
        }
        
        // If we should attempt a retry
        if (shouldRetry) {
          console.log(`Retrying Grok3 API after cooldown (retry ${retryCount + 1}/${MAX_RETRIES})`)
          setLastRetryTime(currentTime)
          
          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1)
          }
        }
      }
      
      setProcessingStage('Verbinden met Grok3 API')
      console.log('Generating response with Grok3 API for super admin...')
      
      // Set a timeout to avoid waiting too long for Grok3
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Grok3 API request timed out')), 15000) // 15 second timeout
      })
      
      // Make the actual API request
      const apiPromise = supabase.functions.invoke('grok3-response', {
        body: {
          message: userInput,
          context: context
        }
      })
      
      // Race between the timeout and API request
      const { data, error } = await Promise.race([
        apiPromise,
        timeoutPromise.then(() => ({ data: null, error: new Error('Timeout') }))
      ]) as any

      if (error) {
        console.error('Error calling Grok3 API:', error)
        setProcessingError('Failed to connect to Grok3 API. Falling back to regular AI.')
        setGrok3Available(false) // Mark as unavailable for future requests
        
        toast({
          title: "Grok3 API Fout",
          description: "Schakel over naar standaard AI-antwoord",
          variant: "destructive"
        })
        
        // Fall back to regular AI response
        await generateRegularAIResponse(userInput)
        return
      }

      const aiResponse = data?.response
      if (!aiResponse) {
        console.error('No response returned from Grok3 API')
        setProcessingError('No response received from Grok3 API. Falling back to regular AI.')
        setGrok3Available(false) // Mark as unavailable for future requests
        
        await generateRegularAIResponse(userInput)
        return
      }

      console.log('Got Grok3 response:', aiResponse.substring(0, 100) + '...')
      setProcessingStage('Processing Grok3 response')
      
      // Reset retry counter on success
      setRetryCount(0)
      setGrok3Available(true)

      // Add AI response to chat history
      addAIResponseToChatHistory(aiResponse)

      // Convert AI response to speech
      await generateSpeech(aiResponse)
      
      toast({
        title: "Succes",
        description: "Grok3 antwoord succesvol gegenereerd",
      })
    } catch (error) {
      console.error('Error generating Grok3 response:', error)
      setProcessingError('Error with Grok3 response. Falling back to regular AI.')
      setGrok3Available(false) // Mark as unavailable for future requests
      
      // Fall back to regular AI response
      await generateRegularAIResponse(userInput)
    }
  }

  const processAudio = async (audioUrl: string) => {
    await baseProcessAudio(audioUrl, generateGrok3Response)
  }

  const processDirectText = async (text: string) => {
    await baseProcessDirectText(text, generateGrok3Response)
  }

  return {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    processingStage,
    grok3Available,
    processAudio,
    processDirectText,
    checkGrok3Availability
  }
}
