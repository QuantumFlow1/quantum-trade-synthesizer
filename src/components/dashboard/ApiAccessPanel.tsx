
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ApiAccessPanelProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const ApiAccessPanel = ({ apiStatus }: ApiAccessPanelProps) => {
  const { toast } = useToast();

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
  );
};
