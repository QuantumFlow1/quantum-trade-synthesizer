
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AgentChatInterface } from "./AgentChatInterface";
import { Agent } from "@/types/agent";

interface AgentChatDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentChatDialog({ agent, open, onOpenChange }: AgentChatDialogProps) {
  if (!agent) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Chat with {agent.name}</DialogTitle>
        </DialogHeader>
        <AgentChatInterface 
          agent={agent} 
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
