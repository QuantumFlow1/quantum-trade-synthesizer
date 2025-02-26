
import { useEffect } from "react";
import { useAuth } from "./auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { ApiAccessPanel } from "./dashboard/ApiAccessPanel";
import { AIAdvicePanel } from "./dashboard/AIAdvicePanel";
import { LLMExtensions } from "./llm-extensions/LLMExtensions";
import { MainContent } from "./dashboard/MainContent";
import { useDashboard } from "@/contexts/DashboardContext";

const UserDashboard = () => {
  const { userProfile, isLovTrader } = useAuth();
  const { toast } = useToast();
  const { visibleWidgets, setVisibleWidgets, apiStatus, setApiStatus } = useDashboard();

  useEffect(() => {
    // Controleer of de API beschikbaar is
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
    
    // Alleen API status controleren als de gebruiker een lov_trader is
    if (isLovTrader) {
      checkApiStatus();
      setVisibleWidgets(prev => ({ ...prev, apiAccess: true }));
    }
  }, [isLovTrader, setApiStatus, setVisibleWidgets]);

  return (
    <DashboardLayout>
      {/* Command Center Header */}
      <DashboardHeader 
        userEmail={userProfile?.email} 
        isLovTrader={isLovTrader}
      />
      
      {/* LLM Extensions Section */}
      {visibleWidgets.llmExtensions && <LLMExtensions />}

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MainContent />

        {/* Financial Advice */}
        {visibleWidgets.advice && <AIAdvicePanel apiStatus={apiStatus} />}

        {/* API Access Section - Only shown for lov_trader */}
        {visibleWidgets.apiAccess && <ApiAccessPanel apiStatus={apiStatus} />}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
