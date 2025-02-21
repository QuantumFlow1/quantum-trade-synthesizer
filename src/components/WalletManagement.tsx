import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { walletService } from "@/services/walletService";
import { Plus, RefreshCw } from "lucide-react";
import { WalletCreationForm } from "./wallet/WalletCreationForm";
import { WalletCard } from "./wallet/WalletCard";
import { TransactionList } from "./wallet/TransactionList";

interface WalletData {
  id: string;
  name: string;
  type: "spot" | "margin" | "futures";
  balance: number;
  available_balance: number;
  locked_balance: number;
  status: "active" | "suspended" | "closed";
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  description?: string;
}

export const WalletManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWallets();
    }
  }, [user]);

  useEffect(() => {
    if (selectedWallet) {
      loadTransactions(selectedWallet);
    }
  }, [selectedWallet]);

  const loadWallets = async () => {
    try {
      if (!user) return;
      const walletData = await walletService.getUserWallets(user.id);
      setWallets(walletData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading wallets:", error);
      toast({
        title: "Error",
        description: "Failed to load wallets",
        variant: "destructive",
      });
    }
  };

  const loadTransactions = async (walletId: string) => {
    try {
      const transactionData = await walletService.getWalletTransactions(walletId);
      setTransactions(transactionData);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    }
  };

  const handleCreateWallet = async (name: string, type: "spot" | "margin" | "futures") => {
    if (!user) return;
    try {
      await walletService.createWallet(user.id, { name, type });
      setIsCreatingWallet(false);
      loadWallets();
      toast({
        title: "Success",
        description: "Wallet created successfully",
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive",
      });
    }
  };

  const handleCreateTransaction = async (type: "deposit" | "withdrawal", amount: string) => {
    if (!selectedWallet) return;
    try {
      await walletService.createTransaction({
        walletId: selectedWallet,
        type,
        amount: Number(amount),
      });
      loadTransactions(selectedWallet);
      loadWallets();
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      });
    }
  };

  const handleWalletCreation = async (wallet: any) => {
    setIsCreatingWallet(false);
    loadWallets();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><RefreshCw className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Wallet Management</h2>
        <Button onClick={() => setIsCreatingWallet(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Wallet
        </Button>
      </div>

      {isCreatingWallet && (
        <WalletCreationForm
          onSuccess={handleWalletCreation}
          onCancel={() => setIsCreatingWallet(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            isSelected={selectedWallet === wallet.id}
            onClick={() => setSelectedWallet(wallet.id)}
          />
        ))}
      </div>

      {selectedWallet && (
        <TransactionList
          transactions={transactions}
          onCreateTransaction={handleCreateTransaction}
        />
      )}
    </div>
  );
};

export default WalletManagement;
