
import { useState, useEffect } from "react";
import { Brain, TrendingUp, AlertTriangle, Users, Wifi, WifiOff, RefreshCw, Key } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { fetchAdminApiKey } from "@/components/chat/services/utils/apiHelpers";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AIAnalysisPanelProps {
  aiAnalysis?: {
    confidence: number;
    riskLevel: string;
    recommendation: string;
    expectedProfit: string;
    stopLossRecommendation: number;
    takeProfitRecommendation: number;
    collaboratingAgents: string[];
  };
  isOnline?: boolean;
}

export const AIAnalysisPanel = ({ aiAnalysis, isOnline = false }: AIAnalysisPanelProps) => {
  const { toast } = useToast();
  const [showTips, setShowTips] = useState(false);
  const [localIsOnline, setLocalIsOnline] = useState<boolean>(isOnline);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isKeySheetOpen, setIsKeySheetOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');

  // Als de prop verandert, werk dan de lokale status bij
  useEffect(() => {
    setLocalIsOnline(isOnline);
  }, [isOnline]);

  // Bij het laden van de component, controleer de status als die nog niet is ingesteld
  useEffect(() => {
    if (!isOnline) {
      checkAPIAvailability();
    }
    
    // Load saved keys
    loadSavedKeys();
  }, []);
  
  const loadSavedKeys = () => {
    const savedOpenAI = localStorage.getItem('openaiApiKey');
    const savedClaude = localStorage.getItem('claudeApiKey');
    const savedGemini = localStorage.getItem('geminiApiKey');
    const savedDeepseek = localStorage.getItem('deepseekApiKey');
    
    if (savedOpenAI) setOpenaiKey(savedOpenAI);
    if (savedClaude) setClaudeKey(savedClaude);
    if (savedGemini) setGeminiKey(savedGemini);
    if (savedDeepseek) setDeepseekKey(savedDeepseek);
  };

  const defaultAnalysis = {
    confidence: 0,
    riskLevel: "Onbekend",
    recommendation: "Niet beschikbaar",
    expectedProfit: "Niet beschikbaar",
    stopLossRecommendation: 0,
    takeProfitRecommendation: 0,
    collaboratingAgents: ["Geen actieve agents"]
  };

  const analysis = aiAnalysis || defaultAnalysis;

  const toggleTips = () => {
    setShowTips(!showTips);
  };
  
  const saveApiKeys = () => {
    if (openaiKey) localStorage.setItem('openaiApiKey', openaiKey);
    if (claudeKey) localStorage.setItem('claudeApiKey', claudeKey);
    if (geminiKey) localStorage.setItem('geminiApiKey', geminiKey);
    if (deepseekKey) localStorage.setItem('deepseekApiKey', deepseekKey);
    
    toast({
      title: "API sleutels opgeslagen",
      description: "Uw API sleutels zijn opgeslagen. Controleer opnieuw de verbinding.",
    });
    
    setIsKeySheetOpen(false);
    
    // Automatically check API availability after saving keys
    setTimeout(() => {
      handleManualUpdate();
    }, 500);
  };

  // Controleert of er API sleutels beschikbaar zijn
  const checkAPIAvailability = async () => {
    try {
      // Controleer of er admin API keys beschikbaar zijn
      const hasOpenAI = await fetchAdminApiKey('openai');
      const hasClaude = await fetchAdminApiKey('claude');
      const hasGemini = await fetchAdminApiKey('gemini');
      const hasDeepseek = await fetchAdminApiKey('deepseek');
      
      // Controleer of er user API keys in localStorage staan
      const openaiKey = localStorage.getItem('openaiApiKey');
      const claudeKey = localStorage.getItem('claudeApiKey');
      const geminiKey = localStorage.getItem('geminiApiKey');
      const deepseekKey = localStorage.getItem('deepseekApiKey');
      
      // Als er ten minste één key beschikbaar is, dan kunnen we doorgaan
      const hasAnyKey = !!(hasOpenAI || hasClaude || hasGemini || hasDeepseek || 
                          openaiKey || claudeKey || geminiKey || deepseekKey);
                          
      console.log("API sleutels beschikbaarheidscontrole:", {
        adminKeys: {
          openai: !!hasOpenAI,
          claude: !!hasClaude,
          gemini: !!hasGemini,
          deepseek: !!hasDeepseek
        },
        localStorageKeys: {
          openai: !!openaiKey,
          claude: !!claudeKey,
          gemini: !!geminiKey,
          deepseek: !!deepseekKey
        },
        hasAnyKey
      });
      
      if (!hasAnyKey) {
        console.log("Geen API sleutels beschikbaar");
        setLocalIsOnline(false);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Fout bij controleren API sleutels:", error);
      return false;
    }
  };

  const handleManualUpdate = async () => {
    setIsChecking(true);
    toast({
      title: "Handmatige verbinding",
      description: "Proberen te verbinden met de AI service...",
    });
    
    try {
      // Controleer eerst of er überhaupt API sleutels beschikbaar zijn
      const hasKeys = await checkAPIAvailability();
      
      if (!hasKeys) {
        throw new Error("Geen API sleutels geconfigureerd");
      }
      
      // Controleer de API-verbinding
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      
      // Als we hier komen, is de verbinding geslaagd
      setLocalIsOnline(true);
      toast({
        title: "Verbinding geslaagd",
        description: "De AI analyseservice is nu beschikbaar.",
      });
    } catch (error) {
      console.error("Fout bij verbinden met AI service:", error);
      setLocalIsOnline(false);
      
      let errorMessage = "De AI analyseservice is momenteel niet beschikbaar.";
      
      if (error.message && error.message.includes("API sleutels")) {
        errorMessage = "Er zijn geen API sleutels geconfigureerd. Voeg deze toe via het admin paneel of in uw persoonlijke instellingen.";
      }
      
      toast({
        title: "Verbindingsstatus",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Wanneer de status offline is, toon een alternatieve weergave
  if (!localIsOnline) {
    return (
      <Card className="p-4 bg-secondary/10 backdrop-blur-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-medium text-muted-foreground">AI Trading Analyse</h3>
          </div>
          <div className="flex items-center gap-2 text-red-400">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Offline</span>
          </div>
        </div>
        
        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-md mb-4">
          <p className="text-sm text-muted-foreground">
            De AI analyseservice is momenteel niet beschikbaar. Dit kan komen door een ontbrekende API sleutel of een tijdelijke onderbreking van de service.
          </p>
        </div>

        <div className="space-y-2">
          <Sheet open={isKeySheetOpen} onOpenChange={setIsKeySheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mb-2" 
              >
                <Key className="w-4 h-4 mr-2" />
                API Sleutels Configureren
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>API Sleutels Instellen</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-api-key">OpenAI API Sleutel</Label>
                  <Input 
                    id="openai-api-key"
                    type="password" 
                    placeholder="sk-..." 
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Vereist voor GPT-4 en andere OpenAI modellen</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="claude-api-key">Claude API Sleutel</Label>
                  <Input 
                    id="claude-api-key"
                    type="password" 
                    placeholder="sk-ant-..." 
                    value={claudeKey}
                    onChange={(e) => setClaudeKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Vereist voor Claude modellen</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gemini-api-key">Gemini API Sleutel</Label>
                  <Input 
                    id="gemini-api-key"
                    type="password" 
                    placeholder="AIza..." 
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Vereist voor Gemini modellen</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deepseek-api-key">DeepSeek API Sleutel</Label>
                  <Input 
                    id="deepseek-api-key"
                    type="password" 
                    placeholder="sk-..." 
                    value={deepseekKey}
                    onChange={(e) => setDeepseekKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Vereist voor DeepSeek modellen</p>
                </div>
                
                <Button className="w-full mt-4" onClick={saveApiKeys}>Opslaan</Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={toggleTips}
          >
            {showTips ? "Verberg" : "Toon"} handmatige trading tips
          </Button>
          
          {showTips && (
            <div className="mt-4 p-3 bg-primary/5 rounded-md text-sm text-muted-foreground">
              <h4 className="font-medium mb-2">Basis Trading Tips:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Zet altijd een stop-loss om verliezen te beperken</li>
                <li>Handel niet met meer dan 2% van je portfolio per trade</li>
                <li>Let op marktvolatiliteit voor het bepalen van in- en uitstappunten</li>
                <li>Overweeg technische indicatoren zoals RSI en MACD</li>
                <li>Volg de markttrend en trend niet tegen de algemene richting in</li>
              </ul>
            </div>
          )}
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full" 
            onClick={handleManualUpdate}
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verbinding controleren...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Probeer opnieuw te verbinden
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  // Normale weergave wanneer online
  return (
    <Card className="p-4 bg-secondary/10 backdrop-blur-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">AI Trading Analyse</h3>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <Wifi className="w-4 h-4" />
          <span className="text-sm">Online</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Vertrouwen: {analysis.confidence}%</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span>Risico: {analysis.riskLevel}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div>Verwachte winst: {analysis.expectedProfit}</div>
          <div>Aanbeveling: {analysis.recommendation}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Samenwerkende AI Agents: {analysis.collaboratingAgents.join(", ")}</span>
      </div>
    </Card>
  );
};
