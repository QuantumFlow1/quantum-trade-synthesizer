
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { checkSupabaseConnection } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

export const ConnectionTest = () => {
  const [isCheckingConnection, setIsCheckingConnection] = useState(false)

  const testSupabaseConnection = async () => {
    setIsCheckingConnection(true)
    try {
      const isConnected = await checkSupabaseConnection()
      if (isConnected) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to all required services including Grok3 API.",
          variant: "default",
        })
      } else {
        toast({
          title: "Connection Warning",
          description: "Some services might not be available. Check console for details.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Connection test error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to test connections. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingConnection(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={testSupabaseConnection}
      disabled={isCheckingConnection}
      className="h-8"
    >
      {isCheckingConnection ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <>Test Connection</>
      )}
    </Button>
  )
}
