
import { useState } from "react";
import { AgentCard } from "./AgentCard";
import { AgentChatDialog } from "./AgentChatDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { Agent } from "@/types/agent";
import { saveApiKey } from "@/utils/apiKeyManager";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentDirectoryProps {
  agents: Agent[];
}

export function AgentDirectory({ agents }: AgentDirectoryProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [apiKeyType, setApiKeyType] = useState<"openai" | "groq">("groq");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();
  
  const handleChatWithAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsChatOpen(true);
  };
  
  const handleSaveApiKey = () => {
    if (apiKey.trim().length > 10) {
      saveApiKey(apiKeyType, apiKey.trim());
      setIsApiKeyDialogOpen(false);
      setApiKey("");
      
      toast({
        title: "API Key Saved",
        description: `Your ${apiKeyType.toUpperCase()} API key has been saved. You can now chat with AI trading agents.`,
        duration: 3000
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: `Please enter a valid ${apiKeyType.toUpperCase()} API key`,
        variant: "destructive",
        duration: 4000
      });
    }
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard 
            key={agent.id}
            agent={agent}
            onChatWithAgent={handleChatWithAgent}
            onConfigureApiKey={() => setIsApiKeyDialogOpen(true)}
          />
        ))}
      </div>
      
      {/* Agent Chat Dialog */}
      <AgentChatDialog 
        agent={selectedAgent}
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
      
      {/* API Key Configuration Dialog */}
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure AI API Keys</DialogTitle>
            <DialogDescription>
              An AI API key is required to chat with trading agents. This key is stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="groq" onValueChange={(value) => setApiKeyType(value as "openai" | "groq")}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="groq">Groq API</TabsTrigger>
              <TabsTrigger value="openai">OpenAI API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="groq">
              <div className="space-y-2">
                <Label htmlFor="groqApiKey">Groq API Key</Label>
                <Input
                  id="groqApiKey"
                  type="password"
                  placeholder="gsk_..."
                  value={apiKeyType === "groq" ? apiKey : ""}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  <a 
                    href="https://console.groq.com/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    Get a Groq API key
                  </a>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="openai">
              <div className="space-y-2">
                <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKeyType === "openai" ? apiKey : ""}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    Get an OpenAI API key
                  </a>
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <p className="text-xs text-muted-foreground mt-2">
            Your API key is stored locally and never sent to our servers.
          </p>
          
          <DialogFooter className="mt-4">
            <Button onClick={handleSaveApiKey} className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
