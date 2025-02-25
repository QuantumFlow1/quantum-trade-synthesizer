
import { LogOut, Activity, LineChart, AlertCircle, Unlock, Zap, Settings, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import MarketOverview from "./MarketOverview";
import TradingChart from "./TradingChart";
import TradeControls from "./TradeControls";
import TransactionList from "./TransactionList";
import PerformanceMetrics from "./PerformanceMetrics";
import AutoTrading from "./AutoTrading";
import RiskManagement from "./RiskManagement";
import Alerts from "./Alerts";
import FinancialAdvice from "./FinancialAdvice";
import { DashboardSettings } from "./DashboardSettings";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const UserDashboard = () => {
  const { signOut, userProfile, isLovTrader } = useAuth();
  const { toast } = useToast();
  const [visibleWidgets, setVisibleWidgets] = useState({
    market: true,
    performance: true,
    trading: true,
    autoTrading: true,
    riskManagement: true,
    transactions: true,
    alerts: true,
    advice: true,
    apiAccess: false
  });
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

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
  }, [isLovTrader]);

  const handleAction = (action: string) => {
    toast({
      title: "Actie uitgevoerd",
      description: `${action} is succesvol uitgevoerd`,
    });
  };

  const triggerApiAction = async (actionType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: {
          message: `Perform ${actionType} analysis and return the results in a concise format`,
          context: []
        }
      });
      
      if (error) throw error;
      
      toast({
        title: `${actionType} Analyse Voltooid`,
        description: "De resultaten zijn beschikbaar in de console",
      });
      
      console.log(`${actionType} Analysis Results:`, data);
    } catch (error) {
      console.error(`Error in ${actionType} analysis:`, error);
      toast({
        title: "Analyse Fout",
        description: `Kon ${actionType} analyse niet uitvoeren`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gradient-to-br from-background via-background/95 to-background/90 animate-in fade-in duration-1000">
      <DashboardSettings />
      
      {/* Command Center Header */}
      <div className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-lg" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gradient">Welcome Commander, {userProfile?.email}</h1>
            <p className="text-muted-foreground">
              Quantum Trading Interface 
              {isLovTrader && <span className="ml-2 inline-flex items-center text-primary"><Unlock className="w-3 h-3 mr-1" /> API Access Enabled</span>}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Uitloggen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
