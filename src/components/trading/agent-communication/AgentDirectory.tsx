
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

interface AgentDirectoryProps {
  agents: Agent[];
}

export function AgentDirectory({ agents }: AgentDirectoryProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();
  
  const handleChatWithAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsChatOpen(true);
  };
  
  const handleSaveApiKey = () => {
    if (apiKey.trim().length > 10) {
      saveApiKey('openai', apiKey.trim());
      setIsApiKeyDialogOpen(false);
      setApiKey("");
      
      toast({
        title: "API Key Saved",
        description: "You can now chat with AI trading agents",
        duration: 3000
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key",
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
            <DialogTitle>Configure OpenAI API Key</DialogTitle>
            <DialogDescription>
              An OpenAI API key is required to chat with trading agents. This key is stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
          </div>
          
          <DialogFooter>
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
