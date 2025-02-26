
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Save } from 'lucide-react';
import { ApiKeyInput } from './ApiKeyInput';

interface ApiKeyDialogProps {
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
  claudeKey: string;
  setClaudeKey: (key: string) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  deepseekKey: string;
  setDeepseekKey: (key: string) => void;
  saved: boolean;
  onSave: () => void;
}

export function ApiKeyDialog({
  openaiKey,
  setOpenaiKey,
  claudeKey,
  setClaudeKey,
  geminiKey,
  setGeminiKey,
  deepseekKey,
  setDeepseekKey,
  saved,
  onSave
}: ApiKeyDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>API Sleutels Beheren</DialogTitle>
        <DialogDescription>
          Voer uw API sleutels in voor de verschillende AI-modellen. Deze worden veilig opgeslagen in uw browser.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <ApiKeyInput
          label="OpenAI API Sleutel"
          value={openaiKey}
          onChange={setOpenaiKey}
          placeholder="sk-..."
          description="Vereist voor GPT-4o"
        />
        
        <ApiKeyInput
          label="Claude API Sleutel"
          value={claudeKey}
          onChange={setClaudeKey}
          placeholder="sk-ant-..."
          description="Vereist voor Claude 3"
        />
        
        <ApiKeyInput
          label="Gemini API Sleutel"
          value={geminiKey}
          onChange={setGeminiKey}
          placeholder="AIza..."
          description="Vereist voor Gemini Pro"
        />
        
        <ApiKeyInput
          label="DeepSeek API Sleutel"
          value={deepseekKey}
          onChange={setDeepseekKey}
          placeholder="sk-..."
          description="Vereist voor DeepSeek Coder"
        />
      </div>
      
      <DialogFooter>
        <Button onClick={onSave} className="w-full">
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Opgeslagen!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Sleutels Opslaan
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
