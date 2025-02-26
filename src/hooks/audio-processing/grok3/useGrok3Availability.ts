
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

export const useGrok3Availability = () => {
  const [grok3Available, setGrok3Available] = useState<boolean>(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [checkCount, setCheckCount] = useState<number>(0)
  const [manuallyDisabled, setManuallyDisabled] = useState<boolean>(false)
  const [isChecking, setIsChecking] = useState<boolean>(false)
  
  // The maximum number of retries for the API
  const MAX_RETRY_COUNT = 3
  
  // Reset connection status for the Grok3 API
  const resetGrok3Connection = async (): Promise<void> => {
    console.log('Resetting Grok3 connection status...')
    setManuallyDisabled(false)
    setGrok3Available(false)
    setLastChecked(null)
    setCheckCount(0)
    // Perform a fresh availability check
    await checkGrok3Availability()
  }
  
  // Explicitly disable Grok3 API connection
  const disableGrok3Connection = (): void => {
    console.log('Manually disabling Grok3 connection...')
    setManuallyDisabled(true)
    setGrok3Available(false)
    setLastChecked(new Date())
    
    toast({
      title: "Grok3 API Disabled",
      description: "Grok3 API connection has been manually disabled",
      duration: 3000
    })
  }
  
  // Determine if we should retry the API connection based on check count
  const shouldRetryGrok3 = (): boolean => {
    return checkCount < MAX_RETRY_COUNT && !manuallyDisabled
  }
  
  // Check if Grok3 API is available
  const checkGrok3Availability = useCallback(async (): Promise<boolean> => {
    try {
      // Prevent multiple simultaneous checks
      if (isChecking) {
        console.log('Grok3 availability check already in progress, skipping...')
        return grok3Available
      }
      
      setIsChecking(true)
      console.log('Checking Grok3 API availability...')
      
      // If manually disabled, don't perform any checks
      if (manuallyDisabled) {
        console.log('Grok3 API is manually disabled, skipping check')
        setIsChecking(false)
        return false
      }
      
      // If we've checked too many times, don't retry
      if (checkCount >= MAX_RETRY_COUNT) {
        console.log('Exceeded maximum retry count for Grok3 API check')
        setIsChecking(false)
        return grok3Available
      }
      
      // Call our edge function to check if API keys are valid
      console.log('Calling check-api-keys edge function...')
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { service: 'grok3' }
      })
      
      if (error) {
        console.error('Error checking Grok3 API:', error)
        setGrok3Available(false)
        setCheckCount(prev => prev + 1)
        setIsChecking(false)
        
        toast({
          title: "API Check Failed",
          description: "Could not verify Grok3 API availability",
          variant: "destructive",
          duration: 3000
        })
        
        return false
      }
      
      // Update state with availability status
      const isAvailable = data?.available || false
      setGrok3Available(isAvailable)
      setLastChecked(new Date())
      
      console.log('Grok3 API availability:', isAvailable)
      
      // Show toast only if status changed or first check
      if (isAvailable !== grok3Available || checkCount === 0) {
        toast({
          title: isAvailable ? "Grok3 API Available" : "Grok3 API Unavailable",
          description: isAvailable 
            ? "Successfully connected to Grok3 API" 
            : "Could not connect to Grok3 API. Check your settings or try again later.",
          variant: isAvailable ? "default" : "destructive",
          duration: 3000
        })
      }
      
      setIsChecking(false)
      return isAvailable
      
    } catch (error) {
      console.error('Error in Grok3 availability check:', error)
      setGrok3Available(false)
      setCheckCount(prev => prev + 1)
      setIsChecking(false)
      
      toast({
        title: "API Check Error",
        description: "An unexpected error occurred while checking Grok3 availability",
        variant: "destructive",
        duration: 3000
      })
      
      return false
    }
  }, [grok3Available, checkCount, manuallyDisabled, isChecking])
  
  // Check availability on initial mount
  useEffect(() => {
    if (!manuallyDisabled) {
      checkGrok3Availability()
    }
  }, [manuallyDisabled, checkGrok3Availability])
  
  return {
    grok3Available,
    setGrok3Available,
    lastChecked,
    checkGrok3Availability,
    resetGrok3Connection,
    disableGrok3Connection,
    manuallyDisabled,
    shouldRetryGrok3,
    isChecking
  }
}
