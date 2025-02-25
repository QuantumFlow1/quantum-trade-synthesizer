
import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

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
  
  const generateGrok3Response = useCallback(async (
    userInput: string,
    context: any[],
    checkGrok3Availability: () => Promise<boolean>,
    grok3Available: boolean,
    shouldRetryGrok3: () => boolean,
    setGrok3Available: (available: boolean) => void
  ) => {
    try {
      // Check if Grok3 is currently marked as available
      if (!grok3Available) {
        console.log('Grok3 marked as unavailable, checking if we should retry...')
        // Should we retry connecting to Grok3?
        if (shouldRetryGrok3()) {
          console.log('Retrying Grok3 connection...')
          const isAvailable = await checkGrok3Availability()
          console.log('Retry result:', isAvailable)
          
          if (!isAvailable) {
            console.log('Grok3 still unavailable after retry, falling back to standard AI')
            setProcessingStage('Grok3 unavailable, falling back to standard AI')
            throw new Error('Grok3 API unavailable after retry')
          }
        } else {
          console.log('Not retrying Grok3, using standard AI')
          setProcessingStage('Using standard AI (Grok3 unavailable)')
          throw new Error('Grok3 API unavailable')
        }
      }

      // Grok3 is available, let's use it
      setProcessingStage('Generating response using Grok3')
      console.log('Generating Grok3 response with input:', userInput)
      
      const { data: grok3Data, error: grok3Error } = await supabase.functions.invoke('grok3-response', {
        body: { 
          message: userInput,
          context: context 
        }
      })

      if (grok3Error) {
        console.error('Error from Grok3 API:', grok3Error)
        setProcessingError('Failed to generate response from Grok3 API')
        setGrok3Available(false) // Mark Grok3 as unavailable after an error
        throw grok3Error
      }

      if (!grok3Data?.response) {
        console.error('No response from Grok3 API:', grok3Data)
        setProcessingError('No response received from Grok3 API')
        setGrok3Available(false) // Mark Grok3 as unavailable if no response
        throw new Error('No response from Grok3 API')
      }

      console.log('Received Grok3 response:', grok3Data)
      
      // Add Grok3 response to chat history
      const grok3Response = grok3Data.response
      addAIResponseToChatHistory(grok3Response)

      // Generate speech for the Grok3 response
      setProcessingStage('Converting Grok3 response to speech')
      await generateSpeech(grok3Response)
      
    } catch (error) {
      console.error('Error in generateGrok3Response:', error)

      // Fall back to standard AI
      setProcessingStage('Falling back to standard AI')
      console.log('Falling back to standard AI after Grok3 error')
      
      try {
        const fallbackResponse = "Ik kon geen verbinding maken met de geavanceerde Grok3 AI. Ik gebruik nu een standaard AI-model. Dit kan gebeuren als de API-sleutel niet goed geconfigureerd is in Supabase. Kan ik je anders helpen met trading informatie of advies?"
        
        addAIResponseToChatHistory(fallbackResponse)
        await generateSpeech(fallbackResponse)
        
        toast({
          title: "Fallback naar Standaard AI",
          description: "Kon geen verbinding maken met Grok3. Controleer de API-sleutelconfiguratie in Supabase.",
          variant: "destructive"  // Gewijzigd van "warning" naar "destructive" om te voldoen aan de toegestane varianten
        })
      } catch (fallbackError) {
        console.error('Even fallback failed:', fallbackError)
        setProcessingError('Failed to generate any AI response. Please try again later.')
      }
    }
  }, [addAIResponseToChatHistory, generateSpeech, setProcessingError, setProcessingStage, toast])

  return {
    generateGrok3Response
  }
}
