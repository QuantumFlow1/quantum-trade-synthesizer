
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { saveApiKey } from "@/utils/apiKeyManager";

interface ApiKeySetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApiKeySetupDialog({ isOpen, onClose, onSuccess }: ApiKeySetupDialogProps) {
  const [activeTab, setActiveTab] = useState<"groq" | "openai">("groq");
  const [groqKey, setGroqKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      let success = false;
      
      // Save the active API key
      if (activeTab === "groq" && groqKey.trim()) {
        saveApiKey("groq", groqKey.trim());
        success = true;
      } else if (activeTab === "openai" && openaiKey.trim()) {
        saveApiKey("openai", openaiKey.trim());
        success = true;
      }
      
      if (success) {
        toast({
          title: "API Key Saved",
          description: `Your ${activeTab.toUpperCase()} API key has been saved successfully.`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Please enter a valid API key.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure AI API Keys</DialogTitle>
          <DialogDescription>
            To enable real AI agent interactions, you need to provide an API key.
            These keys are stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "groq" | "openai")}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="groq">Groq API</TabsTrigger>
            <TabsTrigger value="openai">OpenAI API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="groq" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groq-api-key">Groq API Key</Label>
              <Input
                id="groq-api-key"
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
              />
              <p className="text-xs text-muted-foreground">
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Get a Groq API key
                </a>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="openai" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="openai-api-key">OpenAI API Key</Label>
              <Input
                id="openai-api-key"
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-muted-foreground">
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Get an OpenAI API key
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save API Key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
