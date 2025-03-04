
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkSupabaseConnection } from "@/lib/supabase";

export function useConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'offline'>('checking');
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();
  
  // Check if we're in offline/local development mode
  const isOfflineMode = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        !navigator.onLine;

  // Check Supabase connection when hook is initialized
  useEffect(() => {
    if (isOfflineMode) {
      setConnectionStatus('offline');
      return;
    }
    checkConnection();
  }, [isOfflineMode]);
  
  const checkConnection = async () => {
    if (isOfflineMode) {
      setConnectionStatus('offline');
      return;
    }
    
    try {
      setConnectionStatus('checking');
      setIsRetrying(true);
      
      const isConnected = await checkSupabaseConnection();
      
      if (isConnected) {
        setConnectionStatus('connected');
        toast({
          title: "Connection successful",
          description: "Connected to the backend services successfully."
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection issues",
          description: "Some backend services are unavailable. Basic functionality may still work.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setConnectionStatus('error');
      toast({
        title: "Connection error",
        description: "An error occurred while checking the connection.",
        variant: "destructive",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    connectionStatus,
    isRetrying,
    checkConnection
  };
}
