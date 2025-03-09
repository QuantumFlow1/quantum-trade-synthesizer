
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/contexts/DashboardContext";

interface ApiCheckerProps {
  isLovTrader: boolean;
}

export const ApiChecker: React.FC<ApiCheckerProps> = ({ isLovTrader }) => {
  const { apiStatus, setApiStatus, setVisibleWidgets } = useDashboard();

  useEffect(() => {
    // Check if API is available
    const checkApiStatus = async () => {
      try {
        setApiStatus('checking');
        const { data, error } = await supabase.functions.invoke('grok3-response', {
          body: {
            message: "Give me a simple test response",
            context: []
          }
        });
        
        if (error) {
          console.error("API status check failed:", error);
          setApiStatus('unavailable');
        } else {
          console.log("API status check successful:", data);
          setApiStatus('available');
        }
      } catch (error) {
        console.error("Error checking API status:", error);
        setApiStatus('unavailable');
      }
    };
    
    // Only check API status if user is a lov_trader
    if (isLovTrader) {
      checkApiStatus();
      setVisibleWidgets(prev => ({ ...prev, apiAccess: true }));
    }
  }, [isLovTrader, setApiStatus, setVisibleWidgets]);

  return null; // This is a non-visual component
};
