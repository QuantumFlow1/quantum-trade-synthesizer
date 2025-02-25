
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, PowerOff } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface ConnectionTestProps {
  grok3Available: boolean
  manuallyDisabled?: boolean
  checkGrok3Availability: () => Promise<void>
  resetGrok3Connection: () => Promise<void>
  disableGrok3Connection?: () => void
}

export const ConnectionTest = ({
  grok3Available,
  manuallyDisabled = false,
  checkGrok3Availability,
  resetGrok3Connection,
  disableGrok3Connection
}: ConnectionTestProps) => {
  const [isChecking, setIsChecking] = useState<boolean>(false)
  const [isResetting, setIsResetting] = useState<boolean>(false)
  
  const handleCheckConnection = async () => {
    setIsChecking(true)
    try {
      await checkGrok3Availability()
    } catch (error) {
      console.error('Error checking Grok3 availability:', error)
    } finally {
      setIsChecking(false)
    }
  }
  
  const handleResetConnection = async () => {
    setIsResetting(true)
    try {
      await resetGrok3Connection()
    } catch (error) {
      console.error('Error resetting connection:', error)
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
    // Check connection on mount
    if (!manuallyDisabled) {
      checkGrok3Availability()
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
        
        {disableGrok3Connection && (
          <div className="flex items-center justify-between border p-3 rounded-md">
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
