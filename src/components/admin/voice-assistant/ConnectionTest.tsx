
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

interface ConnectionTestProps {
  grok3Available: boolean
  checkGrok3Availability: () => Promise<boolean>
  resetGrok3Connection: () => Promise<void>
}

export const ConnectionTest = ({
  grok3Available,
  checkGrok3Availability,
  resetGrok3Connection
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
  
  useEffect(() => {
    // Check connection on mount
    checkGrok3Availability()
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
            {grok3Available ? (
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
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleCheckConnection}
          disabled={isChecking || isResetting}
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
          disabled={isChecking || isResetting}
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
