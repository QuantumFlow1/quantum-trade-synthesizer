
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ApiKeySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
  claudeKey: string;
  setClaudeKey: (key: string) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  deepseekKey: string;
  setDeepseekKey: (key: string) => void;
  onSave: () => void;
}

export const ApiKeySheet = ({ 
  isOpen, 
  onOpenChange,
  openaiKey,
  setOpenaiKey,
  claudeKey,
  setClaudeKey,
  geminiKey,
  setGeminiKey,
  deepseekKey,
  setDeepseekKey,
  onSave
}: ApiKeySheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
          
          <Button className="w-full mt-4" onClick={onSave}>Opslaan</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
