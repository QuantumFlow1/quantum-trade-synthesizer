
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Brain, AlertCircle, WifiOff, Wifi, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AIAdvicePanelProps {
  apiStatus?: 'checking' | 'available' | 'unavailable';
  isCheckingKeys?: boolean;
  onManualCheck?: () => void;
}

export function AIAdvicePanel({ apiStatus = 'checking', isCheckingKeys = false, onManualCheck }: AIAdvicePanelProps) {
  const { toast } = useToast();
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (apiStatus === 'available') {
      fetchAdvice();
    }
  }, [apiStatus]);

  const fetchAdvice = async () => {
    if (apiStatus !== 'available') {
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-advice', {
        body: { topic: "trading" }
      });
      
      if (error) throw error;
      
      if (data && data.advice) {
        setAdvice(data.advice);
      } else {
        console.error("No advice returned from API");
      }
    } catch (error) {
      console.error("Failed to fetch advice:", error);
      setAdvice(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualCheck = () => {
    if (onManualCheck) {
      onManualCheck();
      toast({
        title: "API status controleren",
        description: "Verbinding met AI-services wordt gecontroleerd..."
      });
    }
  };

  // Offline status
  if (apiStatus === 'unavailable') {
    return (
      <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2" /> Trading Inzicht
          </h2>
          <div className="flex items-center text-red-400 text-sm">
            <WifiOff size={16} className="mr-1" />
            <span>Offline</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-md text-sm text-muted-foreground">
            <h3 className="font-medium text-red-300 mb-1">AI Service niet beschikbaar</h3>
            <p>Er zijn geen API sleutels geconfigureerd of de service is tijdelijk niet beschikbaar.</p>
          </div>
          
          <div className="bg-card/50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Wat u kunt doen:</h3>
            <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
              <li>Controleer of u API sleutels heeft ingesteld in het admin paneel</li>
              <li>Stel uw eigen API sleutels in via de instellingen</li>
              <li>Controleer uw internetverbinding</li>
            </ul>
          </div>
          
          <Button 
            className="w-full" 
            variant="secondary" 
            size="sm"
            onClick={handleManualCheck}
            disabled={isCheckingKeys}
          >
            {isCheckingKeys ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Controleren...
              </>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                Opnieuw proberen
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  // Loading/checking status
  if (apiStatus === 'checking' || isLoading) {
    return (
      <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2" /> Trading Inzicht
          </h2>
          <div className="flex items-center text-blue-400 text-sm">
            <RefreshCw size={16} className="mr-1 animate-spin" />
            <span>Verbinden...</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center">
            <RefreshCw size={24} className="animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">AI-advies wordt geladen...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Normal status with advice
  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Brain className="w-5 h-5 mr-2" /> Trading Inzicht
        </h2>
        <div className="flex items-center text-green-400 text-sm">
          <Wifi size={16} className="mr-1" />
          <span>Online</span>
        </div>
      </div>
      
      {advice ? (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground">{advice}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Geen advies beschikbaar. Probeer het later opnieuw.</p>
          <Button 
            variant="link" 
            size="sm" 
            onClick={fetchAdvice}
            className="mt-2"
          >
            Vernieuwen
          </Button>
        </div>
      )}
    </Card>
  );
}
