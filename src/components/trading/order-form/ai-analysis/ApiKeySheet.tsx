import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export interface ApiKeySheetProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeyStatus: 'available' | 'unavailable' | 'checking';
  onSave?: (keys: { openai: string; claude: string; gemini: string; deepseek: string }) => void;
}

export const ApiKeySheet = ({
  isOpen,
  onClose,
  apiKeyStatus,
  onSave
}: ApiKeySheetProps) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('openai');

  useEffect(() => {
    if (isOpen) {
      const savedOpenAI = localStorage.getItem('openaiApiKey') || '';
      const savedClaude = localStorage.getItem('claudeApiKey') || '';
      const savedGemini = localStorage.getItem('geminiApiKey') || '';
      const savedDeepseek = localStorage.getItem('deepseekApiKey') || '';
      
      setOpenaiKey(savedOpenAI);
      setClaudeKey(savedClaude);
      setGeminiKey(savedGemini);
      setDeepseekKey(savedDeepseek);
    }
  }, [isOpen]);

  const handleSave = () => {
    setIsSaving(true);
    
    if (openaiKey) localStorage.setItem('openaiApiKey', openaiKey);
    if (claudeKey) localStorage.setItem('claudeApiKey', claudeKey);
    if (geminiKey) localStorage.setItem('geminiApiKey', geminiKey);
    if (deepseekKey) localStorage.setItem('deepseekApiKey', deepseekKey);
    
    if (onSave) {
      onSave({
        openai: openaiKey,
        claude: claudeKey,
        gemini: geminiKey,
        deepseek: deepseekKey
      });
    }
    
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>AI API Sleutels</SheetTitle>
          <SheetDescription>
            Voer uw API-sleutels in om verbinding te maken met AI-services voor trading analyses.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="openai">OpenAI</TabsTrigger>
              <TabsTrigger value="claude">Claude</TabsTrigger>
              <TabsTrigger value="gemini">Gemini</TabsTrigger>
              <TabsTrigger value="deepseek">DeepSeek</TabsTrigger>
            </TabsList>
            
            <TabsContent value="openai" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Sleutel</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Voor toegang tot GPT-3.5, GPT-4 en andere OpenAI modellen.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="claude" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="claude-key">Anthropic Claude API Sleutel</Label>
                <Input
                  id="claude-key"
                  type="password"
                  placeholder="sk_ant-..."
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Voor toegang tot Anthropic Claude modellen.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="gemini" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gemini-key">Google Gemini API Sleutel</Label>
                <Input
                  id="gemini-key"
                  type="password"
                  placeholder="AI..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Voor toegang tot Google's Gemini modellen.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="deepseek" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deepseek-key">DeepSeek API Sleutel</Label>
                <Input
                  id="deepseek-key"
                  type="password"
                  placeholder="sk-..."
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Voor toegang tot DeepSeek modellen.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 space-y-2">
            <p className="text-sm">
              API Status: 
              <span className={`ml-2 ${
                apiKeyStatus === 'available' ? 'text-green-500' :
                apiKeyStatus === 'checking' ? 'text-amber-500' : 'text-red-500'
              }`}>
                {apiKeyStatus === 'available' ? 'Beschikbaar' :
                 apiKeyStatus === 'checking' ? 'Controleren...' : 'Niet beschikbaar'}
              </span>
            </p>
            
            <p className="text-xs text-muted-foreground">
              Uw API sleutels worden veilig lokaal opgeslagen in uw browser.
            </p>
          </div>
        </div>
        
        <SheetFooter>
          <Button onClick={onClose} variant="outline">Annuleren</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opslaan...
              </>
            ) : (
              'Opslaan & Verbinden'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
