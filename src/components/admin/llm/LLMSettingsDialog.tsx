
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LLMProviderType } from "./types";
import { AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LLMSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: LLMProviderType;
}

export function LLMSettingsDialog({
  open,
  onOpenChange,
  provider
}: LLMSettingsDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved settings when dialog opens
  useEffect(() => {
    if (open) {
      const savedApiKey = localStorage.getItem(`${provider}ApiKey`) || "";
      setApiKey(savedApiKey);
      
      // For Ollama, load the host URL
      if (provider === "ollama") {
        setBaseUrl(localStorage.getItem("ollamaHost") || "http://localhost:11434");
      } else {
        setBaseUrl("");
      }
    }
  }, [open, provider]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call to validate key
    setTimeout(() => {
      // Save API key to localStorage
      if (apiKey) {
        localStorage.setItem(`${provider}ApiKey`, apiKey);
      } else {
        localStorage.removeItem(`${provider}ApiKey`);
      }
      
      // For Ollama, save the host URL
      if (provider === "ollama" && baseUrl) {
        localStorage.setItem("ollamaHost", baseUrl);
      }
      
      // Trigger event to notify components of API key change
      window.dispatchEvent(new CustomEvent("apikey-updated", {
        detail: { keyType: provider }
      }));
      
      setIsSaving(false);
      onOpenChange(false);
    }, 500);
  };
  
  const getProviderDisplayName = () => {
    const names: Record<LLMProviderType, string> = {
      openai: 'OpenAI',
      groq: 'Groq',
      anthropic: 'Claude (Anthropic)',
      ollama: 'Ollama',
      deepseek: 'DeepSeek'
    };
    
    return names[provider] || provider;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getProviderDisplayName()} Settings</DialogTitle>
          <DialogDescription>
            Configure your {getProviderDisplayName()} API settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder={`Your ${getProviderDisplayName()} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {provider === "ollama" 
                ? "For local Ollama, no API key is required." 
                : `Enter your ${getProviderDisplayName()} API key to use the service.`}
            </p>
          </div>
          
          {provider === "ollama" && (
            <div className="space-y-2">
              <Label htmlFor="base-url">Ollama Host URL</Label>
              <Input
                id="base-url"
                placeholder="http://localhost:11434"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The URL where your Ollama instance is running
              </p>
            </div>
          )}
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {provider === "ollama" 
                ? "Make sure Ollama is running locally with the models you want to use."
                : "API keys are stored in your browser's local storage. For production use, store them securely on the server."}
            </AlertDescription>
          </Alert>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
