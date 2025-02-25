
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useGrok3Availability = () => {
  const { toast } = useToast()
  const [grok3Available, setGrok3Available] = useState<boolean>(true)
  const [retryCount, setRetryCount] = useState<number>(0)
  const [lastRetryTime, setLastRetryTime] = useState<number>(0)
  const [isChecking, setIsChecking] = useState<boolean>(false)
  const MAX_RETRIES = 3
  const RETRY_COOLDOWN = 60000 // 1 minuut cooldown tussen hertestpogingen

  // Controleer Grok3 API beschikbaarheid bij het laden
  useEffect(() => {
    console.log('Initiële controle van Grok3 API beschikbaarheid starten...')
    checkGrok3Availability()
  }, [])

  // Functie om te controleren of Grok3 API beschikbaar is
  const checkGrok3Availability = useCallback(async () => {
    if (isChecking) {
      console.log('Er loopt al een Grok3 beschikbaarheidscontrole, wacht op resultaat...')
      return grok3Available
    }
    
    setIsChecking(true)
    
    try {
      console.log('Controleren of Grok3 API beschikbaar is...')
      
      // Eerst API-sleutels controleren om te zorgen dat ze correct zijn geconfigureerd
      console.log('check-api-keys functie aanroepen...')
      const { data: keyData, error: keyError } = await supabase.functions.invoke('check-api-keys', {
        body: { check: 'grok3' }
      })
      
      if (keyError) {
        console.error('API-sleutelcontrole mislukt:', keyError)
        console.error('Details van fout:', JSON.stringify(keyError))
        toast({
          title: "API Configuratie Fout",
          description: "Kon de API-sleutels niet controleren. Controleer de Supabase-functielogs.",
          variant: "destructive"
        })
        setGrok3Available(false)
        setIsChecking(false)
        return false
      }
      
      console.log('API-sleutelcontrole response:', keyData)
      
      if (!keyData?.apiKeyValid) {
        console.warn('Grok3 API-sleutel is niet geldig of niet geconfigureerd')
        console.warn('Details van API-sleutelcontrole:', JSON.stringify(keyData))
        toast({
          title: "Grok3 API Sleutel Ontbreekt",
          description: "De Grok3 API-sleutel is niet geconfigureerd. Controleer de functiegeheimen in Supabase.",
          variant: "destructive"
        })
        setGrok3Available(false)
        setIsChecking(false)
        return false
      }
      
      // Nu testen we de Grok3 API-verbinding
      console.log('Grok3 API-verbinding testen...')
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "system: ping test", context: [] }
      })
      
      if (error) {
        console.error('Grok3 API-controle mislukt:', error)
        console.error('Details van fout:', JSON.stringify(error))
        setGrok3Available(false)
        toast({
          title: "Grok3 API Niet Beschikbaar",
          description: "Schakel over naar standaard AI. Controleer je API-sleutel in Supabase.",
          variant: "destructive"
        })
        setIsChecking(false)
        return false
      } else if (data?.response === "pong" && data?.status === "available") {
        console.log('Grok3 API is beschikbaar')
        setGrok3Available(true)
        setRetryCount(0) // Reset retryCount bij succesvolle verbinding
        setIsChecking(false)
        return true
      } else {
        console.warn('Onverwachte response van Grok3 API-controle:', data)
        console.warn('Details van response:', JSON.stringify(data))
        setGrok3Available(false)
        toast({
          title: "Grok3 API Niet Beschikbaar",
          description: "Onverwachte respons. Schakel over naar standaard AI.",
          variant: "destructive"
        })
        setIsChecking(false)
        return false
      }
    } catch (error) {
      console.error('Fout bij het controleren van Grok3 API:', error)
      console.error('Details van fout:', JSON.stringify(error))
      setGrok3Available(false)
      toast({
        title: "Grok3 API Fout",
        description: "Kon niet verbinden met Grok3 API. Schakel over naar standaard AI.",
        variant: "destructive"
      })
      setIsChecking(false)
      return false
    }
  }, [toast, grok3Available, isChecking])

  const shouldRetryGrok3 = useCallback(() => {
    const currentTime = Date.now()
    const shouldRetry = lastRetryTime === 0 || (currentTime - lastRetryTime > RETRY_COOLDOWN)
    
    if (retryCount >= MAX_RETRIES && !shouldRetry) {
      console.log(`Maximum aantal pogingen (${MAX_RETRIES}) bereikt en cooldown periode is nog niet verstreken.`)
      return false
    }
    
    if (shouldRetry) {
      console.log(`Nieuwe poging toegestaan. Poging ${retryCount + 1} van ${MAX_RETRIES}.`)
      setLastRetryTime(currentTime)
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1)
      }
      return true
    }
    
    console.log(`Geen nieuwe poging toegestaan. Wacht nog ${Math.ceil((RETRY_COOLDOWN - (currentTime - lastRetryTime)) / 1000)} seconden.`)
    return false
  }, [retryCount, lastRetryTime])

  const resetGrok3Connection = useCallback(() => {
    console.log('Grok3 verbinding handmatig resetten...')
    setRetryCount(0)
    setLastRetryTime(0)
    return checkGrok3Availability()
  }, [checkGrok3Availability])

  return {
    grok3Available,
    setGrok3Available,
    retryCount,
    checkGrok3Availability,
    shouldRetryGrok3,
    resetGrok3Connection,
    isChecking
  }
}
