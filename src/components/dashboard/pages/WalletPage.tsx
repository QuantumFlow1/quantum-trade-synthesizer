
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { WalletTransactions } from "@/components/wallet/WalletTransactions";
import { WalletActions } from "@/components/wallet/WalletActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export const WalletPage = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const { toast } = useToast();

  // Simulate loading wallet data
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock connection check (in real app, this would check if wallet is connected)
        const mockConnected = localStorage.getItem("walletConnected") === "true";
        setWalletConnected(mockConnected);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading wallet data:", error);
        toast({
          title: "Error loading wallet data",
          description: "Unable to load your wallet information. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadWalletData();
  }, [toast]);

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setWalletConnected(true);
    localStorage.setItem("walletConnected", "true");
    
    toast({
      title: "Wallet Connected",
      description: "Your wallet has been successfully connected",
    });
  };

  const handleDisconnectWallet = () => {
    // Simulate wallet disconnection
    setWalletConnected(false);
    localStorage.removeItem("walletConnected");
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Wallet className="w-5 h-5 mr-2" /> Wallet
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {walletConnected ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 max-w-md mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <WalletOverview onDisconnect={handleDisconnectWallet} />
                </TabsContent>
                <TabsContent value="transactions">
                  <WalletTransactions />
                </TabsContent>
                <TabsContent value="actions">
                  <WalletActions />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">
                    Connect your wallet to access trading features, manage your assets, and view your transaction history.
                  </p>
                </div>
                <button
                  onClick={handleConnectWallet}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};
