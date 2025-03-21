
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Key, Check, Lock, AlertCircle, Link2 } from "lucide-react";
import { saveApiKey, getApiKey, hasApiKey } from "@/utils/apiKeyManager";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface APIKeysConfigurationProps {
  providers: Record<string, boolean>;
  onConfigured: () => void;
}

export function APIKeysConfiguration({ providers, onConfigured }: APIKeysConfigurationProps) {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    openai: "",
    groq: "",
    anthropic: "",
    gemini: "",
    deepseek: "",
    ollama: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({
    openai: false,
    groq: false,
    anthropic: false,
    gemini: false,
    deepseek: false,
    ollama: false
  });
  
  // Mask existing keys on component mount
  useEffect(() => {
    const maskedKeys: Record<string, string> = {};
    
    Object.keys(apiKeys).forEach(provider => {
      if (hasApiKey(provider)) {
        maskedKeys[provider] = "••••••••••••••••••••••••••";
      } else {
        maskedKeys[provider] = "";
      }
    });
    
    setApiKeys(maskedKeys);
    checkApiStatus();
  }, []);
  
  // Check API connection status
  const checkApiStatus = async () => {
    const newStatus: Record<string, boolean> = { ...apiStatus };
    
    // Check OpenAI
    if (hasApiKey('openai')) {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { service: 'openai' }
        });
        newStatus.openai = !error && data?.available;
      } catch (error) {
        console.error("Error checking OpenAI:", error);
      }
    }
    
    // Check Groq
    if (hasApiKey('groq')) {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { service: 'groq' }
        });
        newStatus.groq = !error && data?.available;
      } catch (error) {
        console.error("Error checking Groq:", error);
      }
    }
    
    // Check Anthropic/Claude
    if (hasApiKey('anthropic') || hasApiKey('claude')) {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { service: 'claude' }
        });
        newStatus.anthropic = !error && data?.available;
      } catch (error) {
        console.error("Error checking Claude:", error);
      }
    }
    
    setApiStatus(newStatus);
  };
  
  // Handle API key input change
  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };
  
  // Handle save API key
  const handleSaveApiKey = async (provider: string) => {
    const key = apiKeys[provider];
    
    if (!key || key === "••••••••••••••••••••••••••") {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = saveApiKey(provider, key);
      
      if (success) {
        toast({
          title: "API Key Saved",
          description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} API key has been saved`,
        });
        
        // Mask the key
        setApiKeys(prev => ({
          ...prev,
          [provider]: "••••••••••••••••••••••••••"
        }));
        
        // Update parent component
        onConfigured();
        
        // Check API status
        await checkApiStatus();
      }
    } catch (error) {
      console.error(`Error saving ${provider} API key:`, error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Provider details
  const providerDetails = {
    openai: {
      title: "OpenAI API Key",
      placeholder: "sk-...",
      website: "https://platform.openai.com/api-keys",
      linkText: "OpenAI platform"
    },
    groq: {
      title: "Groq API Key",
      placeholder: "gsk_...",
      website: "https://console.groq.com/keys",
      linkText: "Groq console"
    },
    anthropic: {
      title: "Claude API Key",
      placeholder: "sk-ant-...",
      website: "https://console.anthropic.com/account/keys",
      linkText: "Anthropic console"
    },
    gemini: {
      title: "Google AI API Key",
      placeholder: "AI...",
      website: "https://aistudio.google.com/app/apikey",
      linkText: "Google AI Studio"
    },
    deepseek: {
      title: "DeepSeek API Key",
      placeholder: "sk-...",
      website: "https://platform.deepseek.com/api_keys",
      linkText: "DeepSeek platform"
    },
    ollama: {
      title: "Ollama Host",
      placeholder: "http://localhost:11434",
      website: "https://ollama.com/",
      linkText: "Ollama website"
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">API Key Configuration</h2>
      <p className="text-sm text-muted-foreground mb-2">
        Configure API keys for each LLM provider. Keys are stored securely in your browser's local storage.
      </p>
      
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Security Notice</AlertTitle>
        <AlertDescription>
          API keys are stored locally in your browser. For enhanced security, 
          consider using the admin panel to configure API keys server-side.
        </AlertDescription>
      </Alert>
      
      <Accordion type="multiple" className="w-full">
        {Object.keys(providerDetails).map((provider) => (
          <AccordionItem key={provider} value={provider}>
            <AccordionTrigger className="text-base font-medium">
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                {providerDetails[provider as keyof typeof providerDetails].title}
                {apiStatus[provider] && (
                  <Check className="h-4 w-4 ml-2 text-green-500" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-6 gap-2">
                  <div className="col-span-5">
                    <Input
                      id={`${provider}-key`}
                      placeholder={providerDetails[provider as keyof typeof providerDetails].placeholder}
                      value={apiKeys[provider]}
                      onChange={(e) => handleApiKeyChange(provider, e.target.value)}
                      type="password"
                      className="font-mono"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button 
                      onClick={() => handleSaveApiKey(provider)}
                      disabled={isSaving || !apiKeys[provider] || apiKeys[provider] === "••••••••••••••••••••••••••"}
                      className="w-full"
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex text-xs text-muted-foreground justify-between">
                  <span>
                    Get from <a 
                      href={providerDetails[provider as keyof typeof providerDetails].website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-primary hover:underline flex items-center"
                    >
                      {providerDetails[provider as keyof typeof providerDetails].linkText}
                      <Link2 className="h-3 w-3 ml-1" />
                    </a>
                  </span>
                  <span className="text-right">
                    {hasApiKey(provider) ? 
                      (apiStatus[provider] ? 
                        "✅ Connected" : 
                        "⚠️ Key present but not verified") : 
                      "❌ Not configured"}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
