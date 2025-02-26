
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, PowerOff, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface ConnectionTestProps {
  grok3Available: boolean
  manuallyDisabled?: boolean
  isChecking?: boolean
  checkGrok3Availability: () => Promise<void>
  resetGrok3Connection: () => Promise<void>
  disableGrok3Connection?: () => void
}

export const ConnectionTest = ({
  grok3Available,
  manuallyDisabled = false,
  isChecking = false,
  checkGrok3Availability,
  resetGrok3Connection,
  disableGrok3Connection
}: ConnectionTestProps) => {
  const [isResetting, setIsResetting] = useState<boolean>(false)
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [secretStatus, setSecretStatus] = useState<'unknown' | 'set' | 'not_set'>('unknown')
  
  // Check if the GROK3_API_KEY is set in the Supabase secrets
  const checkSecretStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { service: 'grok3', checkSecret: true }
      })
      
      if (error) {
        console.error('Error checking secret status:', error)
        setSecretStatus('unknown')
        return
      }
      
      setSecretStatus(data?.secretSet ? 'set' : 'not_set')
    } catch (error) {
      console.error('Exception checking secret status:', error)
      setSecretStatus('unknown')
    }
  }
  
  const handleCheckConnection = async () => {
    try {
      await checkGrok3Availability()
      await checkSecretStatus()
    } catch (error) {
      console.error('Error checking Grok3 availability:', error)
      toast({
        title: "Connection Check Failed",
        description: "Could not verify API connection status",
        variant: "destructive"
      })
    }
  }
  
  const handleResetConnection = async () => {
    setIsResetting(true)
    try {
      await resetGrok3Connection()
      await checkSecretStatus()
      toast({
        title: "Connection Reset",
        description: "Grok3 API connection has been reset",
        duration: 3000
      })
    } catch (error) {
      console.error('Error resetting connection:', error)
      toast({
        title: "Reset Failed",
        description: "Could not reset API connection",
        variant: "destructive"
      })
    } finally {
      setIsResetting(false)
    }
  }
  
  const handleConnectionToggle = (enabled: boolean) => {
    if (!enabled && disableGrok3Connection) {
      disableGrok3Connection()
    } else if (enabled) {
      handleResetConnection()
    }
  }
  
  useEffect(() => {
    // Check connection and secret status on mount
    if (!manuallyDisabled) {
      checkGrok3Availability()
      checkSecretStatus()
    }
  }, [])
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Grok3 API Connection Status</CardTitle>
        <CardDescription>
          Verify connection to the Grok3 API for advanced conversational AI capabilities
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Status:</span>
          <div className="flex items-center gap-2">
            {manuallyDisabled ? (
              <>
                <PowerOff className="h-5 w-5 text-orange-500" />
                <span className="text-orange-500 font-semibold">Manually Disabled</span>
              </>
            ) : isChecking ? (
              <>
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                <span className="text-blue-500 font-semibold">Checking...</span>
              </>
            ) : grok3Available ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-500 font-semibold">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-500 font-semibold">Disconnected</span>
              </>
            )}
          </div>
        </div>
        
        {secretStatus !== 'unknown' && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium">API Key:</span>
            <div className="flex items-center gap-2">
              {secretStatus === 'set' ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 text-sm">Set in Supabase Secrets</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-amber-500 text-sm">Not Set in Supabase Secrets</span>
                </>
              )}
            </div>
          </div>
        )}
        
        {disableGrok3Connection && (
          <div className="flex items-center justify-between border p-3 rounded-md mt-4">
            <div>
              <h3 className="font-medium">Enable Grok3 API</h3>
              <p className="text-sm text-muted-foreground">
                Turn off to disable Grok3 and use fallback AI service
              </p>
            </div>
            <Switch
              checked={!manuallyDisabled}
              onCheckedChange={handleConnectionToggle}
              disabled={isChecking || isResetting}
            />
          </div>
        )}
        
        {showDetails && !grok3Available && !manuallyDisabled && (
          <div className="bg-gray-50 p-3 rounded-md text-sm mt-2">
            <h4 className="font-medium mb-2">Troubleshooting Tips:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify that the GROK3_API_KEY is set in Supabase Edge Function secrets</li>
              <li>Check Edge Function logs for any errors</li>
              <li>Try using a fallback model that uses local API keys</li>
              <li>If issues persist, contact support</li>
            </ul>
          </div>
        )}
        
        <Button 
          variant="link" 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs px-0"
        >
          {showDetails ? "Hide Details" : "Show Troubleshooting Tips"}
        </Button>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleCheckConnection}
          disabled={isChecking || isResetting || manuallyDisabled}
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Connection'
          )}
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={handleResetConnection}
          disabled={isChecking || isResetting || manuallyDisabled}
        >
          {isResetting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Connection'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
