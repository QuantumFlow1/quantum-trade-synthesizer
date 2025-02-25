
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useGrok3Availability = () => {
  const { toast } = useToast()
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

  const shouldRetryGrok3 = useCallback(() => {
    const currentTime = Date.now()
    const shouldRetry = lastRetryTime === 0 || (currentTime - lastRetryTime > RETRY_COOLDOWN)
    
    if (retryCount >= MAX_RETRIES && !shouldRetry) {
      return false
    }
    
    if (shouldRetry) {
      setLastRetryTime(currentTime)
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1)
      }
      return true
    }
    
    return false
  }, [retryCount, lastRetryTime])

  return {
    grok3Available,
    setGrok3Available,
    retryCount,
    checkGrok3Availability,
    shouldRetryGrok3
  }
}
