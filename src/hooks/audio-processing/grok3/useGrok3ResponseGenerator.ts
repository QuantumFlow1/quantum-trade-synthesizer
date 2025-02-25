
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { createAssistantMessage } from '../utils/messageUtils'
import { ChatMessage } from '@/components/admin/types/chat-types'

interface UseGrok3ResponseGeneratorProps {
  addAIResponseToChatHistory: (message: ChatMessage) => void
  generateSpeech: (text: string) => Promise<void>
  setProcessingError: (error: string | null) => void
  setProcessingStage: (stage: string) => void
}

export const useGrok3ResponseGenerator = ({
  addAIResponseToChatHistory,
  generateSpeech,
  setProcessingError,
  setProcessingStage
}: UseGrok3ResponseGeneratorProps) => {
  const generateGrok3Response = async (
    userInput: string,
    context: any[],
    checkAvailability: () => Promise<boolean>,
    isAvailable: boolean,
    shouldRetry: boolean,
    setAvailable: (available: boolean) => void
  ): Promise<void> => {
    try {
      console.log('Grok3 antwoord genereren met input:', userInput)
      
      // Check if Grok3 API is available
      if (!isAvailable) {
        const available = await checkAvailability()
        if (!available && !shouldRetry) {
          throw new Error('Grok3 API is niet beschikbaar')
        }
        setAvailable(available)
      }
      
      setProcessingStage('Grok3 API aanroepen...')
      
      console.log('Controleren of Grok3 API-sleutel correct is ingesteld...')
      
      // Call Grok3 API via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: {
          message: userInput,
          context: context || []
        }
      })
      
      if (error) {
        console.error('Fout bij aanroepen van Grok3 API:', error)
        throw new Error(`Grok3 API fout: ${error.message}`)
      }
      
      console.log('API-sleutel is geldig, Grok3 aanroepen...')
      
      if (!data || !data.response) {
        throw new Error('Geen geldig antwoord van Grok3 API')
      }
      
      console.log('Grok3 antwoord ontvangen:', data)
      
      // Create and add the AI response message to chat history
      const aiResponseMessage = createAssistantMessage(data.response)
      addAIResponseToChatHistory(aiResponseMessage)
      
      // Generate speech for the AI response
      setProcessingStage('Spraak genereren...')
      console.log('Generating speech for:', data.response)
      
      try {
        await generateSpeech(data.response)
      } catch (speechError) {
        console.error('Fout bij spraakgeneratie, maar chat-antwoord is wel toegevoegd:', speechError)
        // Don't throw error here to ensure chat functionality works even if speech fails
        setProcessingError('Spraakgeneratie mislukt, maar antwoord is wel zichtbaar in de chat.')
      }
      
      setProcessingStage('')
      setProcessingError(null)
      
    } catch (error) {
      console.error('Fout in Grok3 antwoordgeneratie:', error)
      setProcessingError(`Fout: ${error.message}`)
      setProcessingStage('')
      
      // Add error message to chat
      const errorMessage = createAssistantMessage(
        'Er is een fout opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.'
      )
      addAIResponseToChatHistory(errorMessage)
    }
  }
  
  return {
    generateGrok3Response
  }
}
