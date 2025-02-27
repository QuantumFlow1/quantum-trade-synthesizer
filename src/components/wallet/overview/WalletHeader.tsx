
import { useState } from "react";
import { Copy, ExternalLink, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WalletHeaderProps {
  address: string;
  lastUpdated: Date;
  onRefresh: () => Promise<void>;
  onDisconnect: () => void;
}

export const WalletHeader = ({ 
  address, 
  lastUpdated, 
  onRefresh, 
  onDisconnect 
}: WalletHeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { toast } = useToast();

  // Format address for display
  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      {/* Wallet Info */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">Wallet Address:</div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm">{formatAddress(address)}</span>
            <button 
              onClick={() => copyToClipboard(address)}
              className="p-1 rounded-full hover:bg-secondary/50"
              aria-label="Copy wallet address"
            >
              <Copy className="h-3 w-3" />
            </button>
            <a 
              href={`https://etherscan.io/address/${address}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:bg-secondary/50"
              aria-label="View on blockchain explorer"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDisconnect}
          className="text-xs text-destructive hover:text-destructive"
        >
          <LogOut className="h-3 w-3 mr-1" />
          Disconnect
        </Button>
      </div>
    </div>
  );
};
