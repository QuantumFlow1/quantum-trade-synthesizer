
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveApiKey, getApiKey } from "@/utils/apiKeyManager";
import { Bot, Key, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StockbotApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => Promise<void>;
}

export const StockbotApiKeyDialog: React.FC<StockbotApiKeyDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState("groq");
  const [apiKeys, setApiKeys] = useState({
    groq: "",
    openai: "",
    anthropic: "",
    gemini: "",
    mistral: ""
  });
  const { toast } = useToast();

  // Load existing keys when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Load saved keys from localStorage
      setApiKeys({
        groq: getApiKey("groq") || "",
        openai: getApiKey("openai") || "",
        anthropic: getApiKey("anthropic") || "",
        gemini: getApiKey("gemini") || "",
        mistral: getApiKey("mistral") || ""
      });
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      // Save all provided API keys
      Object.entries(apiKeys).forEach(([provider, key]) => {
        if (key.trim()) {
          saveApiKey(provider, key.trim());
        }
      });

      // Notify success
      toast({
        title: "API Keys Saved",
        description: "Your LLM API keys have been saved successfully",
      });

      // Call onSave callback if provided
      if (onSave) {
        await onSave();
      }

      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving API keys:", error);
      toast({
        title: "Error Saving API Keys",
        description: "There was a problem saving your API keys",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> Configure AI API Keys
          </DialogTitle>
          <DialogDescription>
            Enter your API keys to enable AI-powered market analysis and trading insights.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="groq">Groq</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="groq" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groq-api-key">Groq API Key</Label>
              <Input
                id="groq-api-key"
                type="password"
                placeholder="gsk_xxxxxxxxxxxxxxxx"
                value={apiKeys.groq}
                onChange={(e) => setApiKeys({ ...apiKeys, groq: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Enables access to Llama 3 and Mixtral models for market analysis.
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noreferrer"
                  className="ml-1 text-primary hover:underline"
                >
                  Get API key
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="openai" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-api-key">OpenAI API Key</Label>
              <Input
                id="openai-api-key"
                type="password"
                placeholder="sk-xxxxxxxxxxxxxxxx"
                value={apiKeys.openai}
                onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Enables access to GPT-4o models for advanced trading insights.
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noreferrer"
                  className="ml-1 text-primary hover:underline"
                >
                  Get API key
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="other" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="anthropic-api-key">Claude (Anthropic) API Key</Label>
                <Input
                  id="anthropic-api-key"
                  type="password"
                  placeholder="sk-ant-xxxxx"
                  value={apiKeys.anthropic}
                  onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gemini-api-key">Google AI (Gemini) API Key</Label>
                <Input
                  id="gemini-api-key"
                  type="password"
                  placeholder="xxxx"
                  value={apiKeys.gemini}
                  onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mistral-api-key">Mistral API Key</Label>
                <Input
                  id="mistral-api-key"
                  type="password"
                  placeholder="xxxx"
                  value={apiKeys.mistral}
                  onChange={(e) => setApiKeys({ ...apiKeys, mistral: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="flex text-amber-800 text-sm">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">API Key Security Notice</p>
              <p className="text-xs mt-1">
                Your API keys are stored securely in your browser's local storage and are only used for 
                requests to the respective AI providers. We never store or transmit your keys to our servers.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Lock className="h-4 w-4 mr-2" />
            Save API Keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
