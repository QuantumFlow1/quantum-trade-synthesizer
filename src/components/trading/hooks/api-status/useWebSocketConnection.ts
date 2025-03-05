
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useWebSocketConnection() {
  const setupWebSocketConnection = useCallback((
    setApiStatus: (status: 'checking' | 'available' | 'unavailable') => void,
    wsConnection: WebSocket | null
  ) => {
    if (wsConnection) {
      // Close existing connection
      wsConnection.close();
    }
    
    // Due to CSP restrictions, we're using Supabase's Realtime system instead of direct WebSocket
    // This provides a secure way to get real-time updates
    try {
      const channel = supabase.channel('market-data-status')
        .on('broadcast', { event: 'status' }, (payload) => {
          console.log('Received market data status update:', payload);
          if (payload.payload && payload.payload.status) {
            if (payload.payload.status === 'online') {
              setApiStatus('available');
            } else {
              setApiStatus('unavailable');
            }
          }
        })
        .subscribe((status) => {
          console.log('Market data channel status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to market data status channel');
          }
        });
        
      // We'll return a function to clean up the subscription
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error setting up WebSocket connection:', error);
      return () => {};
    }
  }, []);

  return { setupWebSocketConnection };
}
