
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
    context: any[] = [],
    checkGrok3Availability: () => Promise<boolean>,
    grok3Available: boolean,
    shouldRetryGrok3: () => boolean,
    setGrok3Available: (available: boolean) => void
  ) => {
    try {
      // Check if Grok3 is currently marked as available
      if (!grok3Available) {
        console.log('Grok3 gemarkeerd als niet beschikbaar, controleren of we opnieuw moeten proberen...')
        // Should we retry connecting to Grok3?
        if (shouldRetryGrok3()) {
          console.log('Opnieuw verbinding maken met Grok3...')
          const isAvailable = await checkGrok3Availability()
          console.log('Resultaat van herverbinding:', isAvailable)
          
          if (!isAvailable) {
            console.log('Grok3 nog steeds niet beschikbaar na nieuwe poging, terugvallen naar standaard AI')
            setProcessingStage('Grok3 niet beschikbaar, terugvallen naar standaard AI')
            throw new Error('Grok3 API niet beschikbaar na nieuwe poging')
          }
        } else {
          console.log('Geen nieuwe poging voor Grok3, standaard AI wordt gebruikt')
          setProcessingStage('Standaard AI wordt gebruikt (Grok3 niet beschikbaar)')
          throw new Error('Grok3 API niet beschikbaar')
        }
      }

      // Grok3 is available, let's use it
      setProcessingStage('Antwoord genereren met behulp van Grok3')
      console.log('Grok3 antwoord genereren met input:', userInput)
      
      // Eerst controleren of de API-sleutel correct is ingesteld
      console.log('Controleren of Grok3 API-sleutel correct is ingesteld...')
      const { data: keyData, error: keyError } = await supabase.functions.invoke('check-api-keys', {
        body: { check: 'grok3' }
      })
      
      if (keyError) {
        console.error('Fout bij het controleren van Grok3 API-sleutel:', keyError)
        setProcessingStage('Fout bij API-sleutelcontrole, terugvallen naar standaard AI')
        setGrok3Available(false)
        setProcessingError('Kon Grok3 API-sleutel niet controleren: ' + JSON.stringify(keyError))
        throw new Error('Kon Grok3 API-sleutel niet controleren: ' + JSON.stringify(keyError))
      }
      
      if (!keyData?.apiKeyValid) {
        console.error('Grok3 API-sleutel is niet geldig of niet geconfigureerd:', keyData)
        setProcessingStage('Ongeldige API-sleutel, terugvallen naar standaard AI')
        setGrok3Available(false)
        setProcessingError('Ongeldige Grok3 API-sleutel: ' + JSON.stringify(keyData))
        throw new Error('Ongeldige Grok3 API-sleutel: ' + JSON.stringify(keyData))
      }
      
      console.log('API-sleutel is geldig, Grok3 aanroepen...')
      
      // Nu de werkelijke Grok3 API aanroepen
      const { data: grok3Data, error: grok3Error } = await supabase.functions.invoke('grok3-response', {
        body: { 
          message: userInput,
          context: context || []
        }
      })

      if (grok3Error) {
        console.error('Fout van Grok3 API:', grok3Error)
        setProcessingError('Kon geen antwoord genereren van Grok3 API: ' + JSON.stringify(grok3Error))
        setGrok3Available(false) // Mark Grok3 as unavailable after an error
        throw grok3Error
      }

      if (!grok3Data?.response) {
        console.error('Geen antwoord van Grok3 API:', grok3Data)
        setProcessingError('Geen antwoord ontvangen van Grok3 API')
        setGrok3Available(false) // Mark Grok3 as unavailable if no response
        throw new Error('Geen antwoord van Grok3 API')
      }

      console.log('Grok3 antwoord ontvangen:', grok3Data)
      
      // Add Grok3 response to chat history
      const grok3Response = grok3Data.response
      addAIResponseToChatHistory(grok3Response)
      
      // Generate speech from the response
      setProcessingStage('Grok3 antwoord omzetten naar spraak')
      try {
        await generateSpeech(grok3Response)
      } catch (speechError) {
        console.error('Fout bij het genereren van spraak:', speechError)
        setProcessingError('Kon spraak niet genereren: ' + (speechError.message || 'Onbekende fout'))
        // Continue with the function despite speech error
      }
      
      return grok3Response
    } catch (error) {
      console.error('Error in generateGrok3Response:', error)
      setProcessingError('Fout bij het genereren van een antwoord: ' + (error.message || 'Onbekende fout'))
      throw error // Re-throw to be handled by the caller
    }
  }, [addAIResponseToChatHistory, generateSpeech, setProcessingError, setProcessingStage])

  return {
    generateGrok3Response
  }
}
