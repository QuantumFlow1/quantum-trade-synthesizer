
import { Wallet, RefreshCw, LogOut, Copy, ExternalLink, CreditCard, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WalletType } from "../types/walletTypes";

interface WalletHeaderProps {
  address: string;
  lastUpdated: Date;
  onRefresh: () => void;
  onDisconnect: () => void;
  walletType: WalletType;
}

export const WalletHeader = ({
  address,
  lastUpdated,
  onRefresh,
  onDisconnect,
  walletType
}: WalletHeaderProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
  };

  const getWalletIcon = () => {
    if (walletType === 'crypto') {
      return <Bitcoin className="h-5 w-5 mr-2" />;
    } else {
      return <CreditCard className="h-5 w-5 mr-2" />;
    }
  };

  const getWalletTitle = () => {
    if (walletType === 'crypto') {
      return "Cryptocurrency Wallet";
    } else {
      return "Fiat Currency Wallet";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-xl font-bold flex items-center">
          {getWalletIcon()}
          {getWalletTitle()}
        </h2>
        
        <div className="flex items-center mt-2 space-x-2">
          <div className="text-sm text-muted-foreground flex items-center">
            <span className="hidden sm:inline mr-2">Address:</span>
            <span className="font-mono text-xs truncate max-w-[180px] sm:max-w-xs">
              {address}
            </span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={copyToClipboard}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy address</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {walletType === 'crypto' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" 
                    onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View on blockchain</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground mt-1">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      </div>
      
      <div className="flex space-x-2 w-full sm:w-auto justify-end">
        <Button variant="outline" size="sm" onClick={onRefresh} className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
        
        <Button variant="outline" size="sm" onClick={onDisconnect} className="flex items-center text-red-500">
          <LogOut className="h-4 w-4 mr-1" />
          Disconnect
        </Button>
      </div>
    </div>
  );
};
