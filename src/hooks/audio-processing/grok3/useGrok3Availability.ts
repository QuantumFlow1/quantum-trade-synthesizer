
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export const useGrok3Availability = () => {
  const [grok3Available, setGrok3Available] = useState<boolean>(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [checkCount, setCheckCount] = useState<number>(0)
  const [manuallyDisabled, setManuallyDisabled] = useState<boolean>(false)
  
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
  }
  
  // Determine if we should retry the API connection based on check count
  const shouldRetryGrok3 = (): boolean => {
    return checkCount < MAX_RETRY_COUNT && !manuallyDisabled
  }
  
  // Check if Grok3 API is available
  const checkGrok3Availability = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Checking Grok3 API availability...')
      
      // If manually disabled, don't perform any checks
      if (manuallyDisabled) {
        console.log('Grok3 API is manually disabled, skipping check')
        return false
      }
      
      // If we've checked too many times, don't retry
      if (checkCount >= MAX_RETRY_COUNT) {
        console.log('Exceeded maximum retry count for Grok3 API check')
        return grok3Available
      }
      
      // Call our edge function to check if API keys are valid
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { service: 'grok3' }
      })
      
      if (error) {
        console.error('Error checking Grok3 API:', error)
        setGrok3Available(false)
        setCheckCount(prev => prev + 1)
        return false
      }
      
      // Update state with availability status
      setGrok3Available(data?.available || false)
      setLastChecked(new Date())
      
      console.log('Grok3 API availability:', data?.available || false)
      return data?.available || false
      
    } catch (error) {
      console.error('Error in Grok3 availability check:', error)
      setGrok3Available(false)
      setCheckCount(prev => prev + 1)
      return false
    }
  }, [grok3Available, checkCount, manuallyDisabled])
  
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
    shouldRetryGrok3
  }
}
