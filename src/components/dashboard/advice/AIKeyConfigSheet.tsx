
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIKeyConfigSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onManualCheck?: () => void;
}

export function AIKeyConfigSheet({ isOpen, onOpenChange, onSave, onManualCheck }: AIKeyConfigSheetProps) {
  const { toast } = useToast();
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsCheckingAdmin(true);
        
        // Check if user is logged in first
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          setIsAdmin(false);
          setIsCheckingAdmin(false);
          return;
        }
        
        // Check for admin role
        const { data, error } = await supabase.rpc('has_role', {
          user_id: authData.user.id,
          role: 'admin'
        });
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    if (isOpen) {
      checkAdminStatus();
      loadKeysFromStorage();
    }
  }, [isOpen]);
  
  // Load saved API keys on component mount
  const loadKeysFromStorage = () => {
    const savedOpenAI = localStorage.getItem('openaiApiKey') || '';
    const savedClaude = localStorage.getItem('claudeApiKey') || '';
    const savedGemini = localStorage.getItem('geminiApiKey') || '';
    const savedDeepseek = localStorage.getItem('deepseekApiKey') || '';
    const savedGroq = localStorage.getItem('groqApiKey') || '';
    
    console.log('Loading API keys from localStorage:', {
      openai: savedOpenAI ? 'present' : 'not found',
      claude: savedClaude ? 'present' : 'not found',
      gemini: savedGemini ? 'present' : 'not found',
      deepseek: savedDeepseek ? 'present' : 'not found',
      groq: savedGroq ? 'present' : 'not found'
    });
    
    setOpenaiKey(savedOpenAI);
    setClaudeKey(savedClaude);
    setGeminiKey(savedGemini);
    setDeepseekKey(savedDeepseek);
    setGroqKey(savedGroq);
  };
  
  const saveApiKeys = async () => {
    if (!isAdmin) {
      toast({
        title: "Niet toegestaan",
        description: "Alleen administrators kunnen API sleutels instellen.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Store previous values to check what changed
      const prevOpenAI = localStorage.getItem('openaiApiKey');
      const prevClaude = localStorage.getItem('claudeApiKey');
      const prevGemini = localStorage.getItem('geminiApiKey');
      const prevDeepseek = localStorage.getItem('deepseekApiKey');
      const prevGroq = localStorage.getItem('groqApiKey');
      
      // Save new values
      if (openaiKey.trim()) localStorage.setItem('openaiApiKey', openaiKey.trim());
      if (claudeKey.trim()) localStorage.setItem('claudeApiKey', claudeKey.trim());
      if (geminiKey.trim()) localStorage.setItem('geminiApiKey', geminiKey.trim());
      if (deepseekKey.trim()) localStorage.setItem('deepseekApiKey', deepseekKey.trim());
      if (groqKey.trim()) localStorage.setItem('groqApiKey', groqKey.trim());
      
      console.log('Saved API keys to localStorage:', {
        openai: openaiKey ? 'present' : 'not set',
        claude: claudeKey ? 'present' : 'not set',
        gemini: geminiKey ? 'present' : 'not set',
        deepseek: deepseekKey ? 'present' : 'not set',
        groq: groqKey ? 'present' : 'not set'
      });
      
      toast({
        title: "API sleutels opgeslagen",
        description: "Uw API sleutels zijn opgeslagen. Controleer opnieuw de verbinding.",
      });
      
      onOpenChange(false);
      onSave();
      
      // Dispatch custom events for other components
      window.dispatchEvent(new Event('localStorage-changed'));
      window.dispatchEvent(new Event('apikey-updated'));
      
      // For each API key that changed, dispatch a specific event
      if (prevOpenAI !== openaiKey && openaiKey) {
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'openai', status: 'connected' }
        }));
      }
      
      if (prevClaude !== claudeKey && claudeKey) {
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'claude', status: 'connected' }
        }));
      }
      
      if (prevDeepseek !== deepseekKey && deepseekKey) {
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'deepseek', status: 'connected' }
        }));
      }
      
      if (prevGroq !== groqKey && groqKey) {
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'groq', status: 'connected' }
        }));
      }
      
      // Automatically trigger a connection check
      if (onManualCheck) {
        setTimeout(() => {
          onManualCheck();
        }, 500);
      }
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het opslaan van de API sleutels.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          className="w-full mb-2" 
          variant="outline" 
          size="sm"
        >
          <Key size={16} className="mr-2" />
          API Sleutels Status
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>API Sleutels Status</SheetTitle>
        </SheetHeader>
        
        {isCheckingAdmin ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Controleert admin status...</span>
          </div>
        ) : isAdmin ? (
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
            
            <div className="space-y-2">
              <Label htmlFor="groq-api-key">Groq API Sleutel</Label>
              <Input 
                id="groq-api-key"
                type="password" 
                placeholder="gsk_..." 
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Vereist voor Stockbot en Groq functionaliteit</p>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={saveApiKeys}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Opslaan...
                </>
              ) : (
                "Opslaan"
              )}
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <Alert className="bg-amber-50 border-amber-200">
              <Shield className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-800">
                <p className="font-medium mb-2">Alleen voor Administrators</p>
                <p>API Sleutels kunnen alleen door administrators worden geconfigureerd.</p>
                <p className="mt-2">De applicatie gebruikt door de administrator ingestelde API sleutels. Er is geen actie van uw kant nodig.</p>
              </AlertDescription>
            </Alert>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">API Sleutels Status:</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">OpenAI:</span>
                  <span className={openaiKey ? "text-green-600" : "text-gray-400"}>
                    {openaiKey ? "Beschikbaar" : "Niet beschikbaar"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Claude:</span>
                  <span className={claudeKey ? "text-green-600" : "text-gray-400"}>
                    {claudeKey ? "Beschikbaar" : "Niet beschikbaar"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Groq:</span>
                  <span className={groqKey ? "text-green-600" : "text-gray-400"}>
                    {groqKey ? "Beschikbaar" : "Niet beschikbaar"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">DeepSeek:</span>
                  <span className={deepseekKey ? "text-green-600" : "text-gray-400"}>
                    {deepseekKey ? "Beschikbaar" : "Niet beschikbaar"}
                  </span>
                </li>
              </ul>
            </div>
            
            <Button 
              className="w-full mt-6" 
              variant="outline"
              onClick={() => {
                onManualCheck?.();
                onOpenChange(false);
              }}
            >
              Controleer API verbindingen
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
