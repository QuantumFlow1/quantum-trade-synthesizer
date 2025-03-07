
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved API keys on component mount
  useEffect(() => {
    loadKeysFromStorage();
  }, []);
  
  const loadKeysFromStorage = () => {
    const savedOpenAI = localStorage.getItem('openaiApiKey') || '';
    const savedClaude = localStorage.getItem('claudeApiKey') || '';
    const savedGemini = localStorage.getItem('geminiApiKey') || '';
    const savedDeepseek = localStorage.getItem('deepseekApiKey') || '';
    
    console.log('Loading API keys from localStorage:', {
      openai: savedOpenAI ? 'present' : 'not found',
      claude: savedClaude ? 'present' : 'not found',
      gemini: savedGemini ? 'present' : 'not found',
      deepseek: savedDeepseek ? 'present' : 'not found'
    });
    
    setOpenaiKey(savedOpenAI);
    setClaudeKey(savedClaude);
    setGeminiKey(savedGemini);
    setDeepseekKey(savedDeepseek);
  };
  
  const saveApiKeys = async () => {
    setIsSaving(true);
    
    try {
      // Store previous values to check what changed
      const prevOpenAI = localStorage.getItem('openaiApiKey');
      const prevClaude = localStorage.getItem('claudeApiKey');
      const prevGemini = localStorage.getItem('geminiApiKey');
      const prevDeepseek = localStorage.getItem('deepseekApiKey');
      
      // Save new values
      if (openaiKey.trim()) localStorage.setItem('openaiApiKey', openaiKey.trim());
      if (claudeKey.trim()) localStorage.setItem('claudeApiKey', claudeKey.trim());
      if (geminiKey.trim()) localStorage.setItem('geminiApiKey', geminiKey.trim());
      if (deepseekKey.trim()) localStorage.setItem('deepseekApiKey', deepseekKey.trim());
      
      console.log('Saved API keys to localStorage:', {
        openai: openaiKey ? 'present' : 'not set',
        claude: claudeKey ? 'present' : 'not set',
        gemini: geminiKey ? 'present' : 'not set',
        deepseek: deepseekKey ? 'present' : 'not set'
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
      </SheetContent>
    </Sheet>
  );
}
