
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export interface WalletConnectionProps {
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ 
  onConnect,
  onDisconnect
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="p-8 max-w-md w-full space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to view your token balances and trade directly from the platform.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button className="w-full" onClick={onConnect}>
            Connect Wallet
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <p>By connecting, you agree to our <a href="#" className="underline">Terms of Service</a></p>
          </div>
        </div>
      </Card>
    </div>
  );
};
