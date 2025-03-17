
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Key, Check, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { 
  saveApiKey, 
  getApiKey, 
  hasApiKey,
  broadcastApiKeyChange 
} from "@/utils/apiKeyManager";
import { supabase } from "@/lib/supabase";

export const APIKeysTab = () => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    openai: false,
    groq: false,
    claude: false
  });

  useEffect(() => {
    // Mask existing keys on load
    const openaiExists = hasApiKey('openai');
    const groqExists = hasApiKey('groq');
    const claudeExists = hasApiKey('claude');

    if (openaiExists) setOpenaiKey("••••••••••••••••••••••••••");
    if (groqExists) setGroqKey("••••••••••••••••••••••••••");
    if (claudeExists) setClaudeKey("••••••••••••••••••••••••••");

    // Check API status
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    // Check OpenAI
    if (hasApiKey('openai')) {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { service: 'openai' }
        });
        setApiStatus(prev => ({ ...prev, openai: !error && data?.valid }));
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
        setApiStatus(prev => ({ ...prev, groq: !error && data?.valid }));
      } catch (error) {
        console.error("Error checking Groq:", error);
      }
    }

    // Check Claude
    if (hasApiKey('claude')) {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { service: 'claude' }
        });
        setApiStatus(prev => ({ ...prev, claude: !error && data?.valid }));
      } catch (error) {
        console.error("Error checking Claude:", error);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    let successCount = 0;

    try {
      // Save OpenAI key if changed
      if (openaiKey && openaiKey !== "••••••••••••••••••••••••••") {
        const success = saveApiKey('openai', openaiKey);
        if (success) successCount++;
      }

      // Save Groq key if changed
      if (groqKey && groqKey !== "••••••••••••••••••••••••••") {
        const success = saveApiKey('groq', groqKey);
        if (success) successCount++;
      }

      // Save Claude key if changed
      if (claudeKey && claudeKey !== "••••••••••••••••••••••••••") {
        const success = saveApiKey('claude', claudeKey);
        if (success) successCount++;
      }

      if (successCount > 0) {
        toast({
          title: "API Keys Saved",
          description: `Successfully saved ${successCount} API key(s)`,
        });
        
        // Re-check API status
        await checkApiStatus();
      }
    } catch (error) {
      console.error("Error saving API keys:", error);
      toast({
        title: "Error",
        description: "Failed to save API keys",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">AI API Keys</h3>
      <p className="text-muted-foreground text-sm">
        Add API keys to connect to different AI model providers.
      </p>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* OpenAI API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="openai-key" className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                OpenAI API Key
              </Label>
              {apiStatus.openai && (
                <span className="text-xs flex items-center text-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </span>
              )}
            </div>
            <Input
              id="openai-key"
              placeholder="Enter OpenAI API key"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Get from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">OpenAI platform</a>
            </p>
          </div>

          {/* Groq API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="groq-key" className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Groq API Key
              </Label>
              {apiStatus.groq && (
                <span className="text-xs flex items-center text-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </span>
              )}
            </div>
            <Input
              id="groq-key"
              placeholder="Enter Groq API key"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Get from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">Groq console</a>
            </p>
          </div>

          {/* Claude API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="claude-key" className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Claude API Key
              </Label>
              {apiStatus.claude && (
                <span className="text-xs flex items-center text-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </span>
              )}
            </div>
            <Input
              id="claude-key"
              placeholder="Enter Claude API key"
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Get from <a href="https://console.anthropic.com/account/keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">Anthropic console</a>
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save API Keys"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
