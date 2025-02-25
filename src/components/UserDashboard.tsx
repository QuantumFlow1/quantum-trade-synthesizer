
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
import { AIInsights } from "./financial-advice/AIInsights";
import { AdviceHeader } from "./financial-advice/AdviceHeader";
import { PortfolioDiversification } from "./financial-advice/PortfolioDiversification";
import { RiskReturnAnalysis } from "./financial-advice/RiskReturnAnalysis";
import { Recommendations } from "./financial-advice/Recommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

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

  const generateAIAdvice = async () => {
    setIsLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: {
          message: "Generate financial trading advice based on current market conditions. Include specific recommendations on asset allocation, risk management strategies, and market timing. Keep it under 400 characters.",
          context: []
        }
      });
      
      if (error) throw error;
      
      setAiAdvice(data?.response || "Geen advies beschikbaar op dit moment");
    } catch (error) {
      console.error("Error generating AI advice:", error);
      setAiAdvice("Er is een fout opgetreden bij het genereren van advies. Probeer het later opnieuw.");
      toast({
        title: "AI Advies Fout",
        description: "Kon geen AI advies genereren",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
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

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Market Overview Section */}
        {visibleWidgets.market && (
          <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 flex items-center"><Activity className="w-5 h-5 mr-2" /> Market Overview</h2>
            <MarketOverview />
          </Card>
        )}

        {/* Trading Section */}
        {visibleWidgets.trading && (
          <Card className="col-span-full md:col-span-2 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 flex items-center"><LineChart className="w-5 h-5 mr-2" /> Trading Chart</h2>
            <TradingChart />
            {visibleWidgets.trading && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Trade Controls</h3>
                <TradeControls />
              </div>
            )}
          </Card>
        )}

        {/* Performance Metrics */}
        {visibleWidgets.performance && (
          <Card className="md:col-span-1 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 flex items-center"><Zap className="w-5 h-5 mr-2" /> Performance</h2>
            <PerformanceMetrics />
          </Card>
        )}

        {/* Transactions List */}
        {visibleWidgets.transactions && (
          <Card className="col-span-full md:col-span-1 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 flex items-center"><Activity className="w-5 h-5 mr-2" /> Recent Transactions</h2>
            <TransactionList />
          </Card>
        )}

        {/* Risk Management */}
        {visibleWidgets.riskManagement && (
          <Card className="col-span-full md:col-span-1 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 flex items-center"><AlertCircle className="w-5 h-5 mr-2" /> Risk Management</h2>
            <RiskManagement />
          </Card>
        )}

        {/* Auto Trading */}
        {visibleWidgets.autoTrading && (
          <Card className="col-span-full md:col-span-1 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 flex items-center"><Settings className="w-5 h-5 mr-2" /> Auto Trading</h2>
            <AutoTrading />
          </Card>
        )}

        {/* Alerts */}
        {visibleWidgets.alerts && (
          <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 flex items-center"><AlertCircle className="w-5 h-5 mr-2" /> Alerts</h2>
            <Alerts />
          </Card>
        )}

        {/* Financial Advice */}
        {visibleWidgets.advice && (
          <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <AdviceHeader 
              isOnline={apiStatus === 'available'} 
              isLoadingAI={isLoadingAI} 
              onGenerateAdvice={generateAIAdvice} 
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <PortfolioDiversification />
              <RiskReturnAnalysis />
              <AIInsights 
                isOnline={apiStatus === 'available'} 
                aiAdvice={aiAdvice} 
              />
            </div>
            <div className="mt-4">
              <Recommendations />
            </div>
          </Card>
        )}

        {/* API Access Section - Only shown for lov_trader */}
        {visibleWidgets.apiAccess && (
          <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2" /> 
              Geavanceerde API Functies
              <span className={`ml-3 text-sm px-2 py-0.5 rounded ${
                apiStatus === 'available' ? 'bg-green-500/20 text-green-500' : 
                apiStatus === 'checking' ? 'bg-yellow-500/20 text-yellow-500' : 
                'bg-red-500/20 text-red-500'
              }`}>
                {apiStatus === 'available' ? 'Online' : 
                 apiStatus === 'checking' ? 'Controleren...' : 
                 'Offline'}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
                disabled={apiStatus !== 'available'}
                onClick={() => triggerApiAction('Market')}
              >
                Run Market Analysis
              </Button>
              <Button 
                variant="outline" 
                className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
                disabled={apiStatus !== 'available'}
                onClick={() => triggerApiAction('Sentiment')}
              >
                Run Sentiment Analysis
              </Button>
              <Button 
                variant="outline" 
                className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
                disabled={apiStatus !== 'available'}
                onClick={() => triggerApiAction('Prediction')}
              >
                Generate Price Predictions
              </Button>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-secondary/30">
              <h3 className="font-medium mb-2">API Status</h3>
              <div className="text-sm text-muted-foreground">
                {apiStatus === 'available' ? (
                  <p>Grok3 API is beschikbaar. Je kunt geavanceerde analysefuncties gebruiken voor actuele marktgegevens en handelsstrategieën.</p>
                ) : apiStatus === 'checking' ? (
                  <p>API status wordt gecontroleerd...</p>
                ) : (
                  <p>Grok3 API is niet beschikbaar. Neem contact op met support om toegang te krijgen tot geavanceerde analysefuncties.</p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
