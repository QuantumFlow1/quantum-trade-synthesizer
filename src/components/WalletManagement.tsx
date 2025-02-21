
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { walletService } from "@/services/walletService";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";

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
  const [formData, setFormData] = useState({
    name: "",
    type: "spot" as const,
    amount: "",
    transactionType: "deposit" as const,
  });

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

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await walletService.createWallet(user.id, {
        name: formData.name,
        type: formData.type,
      });
      
      setFormData({ ...formData, name: "" });
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

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;

    try {
      await walletService.createTransaction({
        walletId: selectedWallet,
        type: formData.transactionType,
        amount: Number(formData.amount),
      });
      
      setFormData({ ...formData, amount: "" });
      loadTransactions(selectedWallet);
      loadWallets(); // Refresh wallet balances
      
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
        <Card className="p-4">
          <form onSubmit={handleCreateWallet} className="space-y-4">
            <div className="space-y-2">
              <Label>Wallet Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter wallet name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Wallet Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "spot" | "margin" | "futures") => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spot">Spot</SelectItem>
                  <SelectItem value="margin">Margin</SelectItem>
                  <SelectItem value="futures">Futures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreatingWallet(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Wallet</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <Card
            key={wallet.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedWallet === wallet.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedWallet(wallet.id)}
          >
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{wallet.name}</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Type: {wallet.type}</p>
              <p className="font-medium">Balance: ${wallet.balance.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                Available: ${wallet.available_balance.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Locked: ${wallet.locked_balance.toFixed(2)}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {selectedWallet && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Transactions</h3>
          <form onSubmit={handleCreateTransaction} className="flex gap-4 mb-6">
            <Select
              value={formData.transactionType}
              onValueChange={(value: "deposit" | "withdrawal") => 
                setFormData({ ...formData, transactionType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Amount"
              className="max-w-[200px]"
            />
            <Button type="submit">Submit</Button>
          </form>

          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {tx.type === "deposit" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium capitalize">{tx.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${tx.amount.toFixed(2)}</p>
                  <p className={`text-sm ${
                    tx.status === "completed" ? "text-green-500" : 
                    tx.status === "pending" ? "text-yellow-500" : "text-red-500"
                  }`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WalletManagement;
