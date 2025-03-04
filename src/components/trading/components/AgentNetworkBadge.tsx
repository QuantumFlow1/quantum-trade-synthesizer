
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";

interface AgentNetworkBadgeProps {
  isInitialized: boolean;
  activeAgentsCount: number;
}

export const AgentNetworkBadge = ({ 
  isInitialized, 
  activeAgentsCount 
}: AgentNetworkBadgeProps) => {
  if (!isInitialized || activeAgentsCount === 0) {
    return null;
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1 px-2">
      <Network className="h-3 w-3" />
      <span className="text-xs">{activeAgentsCount} AI Agents Active</span>
    </Badge>
  );
};
