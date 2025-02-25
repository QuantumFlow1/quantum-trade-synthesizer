
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { ChatMessage } from '@/components/admin/types/chat-types'

interface Grok3ResponseGeneratorProps {
  addAIResponseToChatHistory: (response: string) => void
  generateSpeech: (text: string) => Promise<void>
  setProcessingError: (error: string | null) => void
  setProcessingStage: (stage: string) => void
}

export const useGrok3ResponseGenerator = ({
  addAIResponseToChatHistory,
  generateSpeech,
  setProcessingError,
  setProcessingStage
}: Grok3ResponseGeneratorProps) => {
  const { toast } = useToast()

  // Function to generate regular AI response as fallback
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

  // Function to generate Grok3 response
  const generateGrok3Response = async (
    userInput: string, 
    context: any[] = [],
    checkGrok3Availability: () => Promise<boolean>,
    grok3Available: boolean,
    shouldRetryGrok3: () => boolean,
    setGrok3Available: (available: boolean) => void
  ) => {
    try {
      // Check Grok3 availability before proceeding
      const isGrok3Available = await checkGrok3Availability()
      
      // If Grok3 is known to be unavailable and we're not due for a retry, skip directly to fallback
      if (!isGrok3Available && !shouldRetryGrok3()) {
        console.log('Skipping Grok3 API due to previous failures, using fallback directly')
        await generateRegularAIResponse(userInput)
        return
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

  return {
    generateRegularAIResponse,
    generateGrok3Response
  }
}
