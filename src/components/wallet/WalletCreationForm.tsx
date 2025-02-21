import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { WalletType } from "@/types/wallet";
import { supabase } from "@/lib/supabase";

interface WalletCreationFormProps {
  onSuccess?: (wallet: any) => void;
}

export const WalletCreationForm = ({ onSuccess }: WalletCreationFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [walletName, setWalletName] = useState<string>("");
  const [selectedType, setSelectedType] = useState<WalletType>("spot");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const { data: wallet, error } = await supabase
      .from('wallets')
      .insert({
        user_id: user?.id,
        name: walletName,
        type: selectedType as "spot", // Force type as "spot" for now
        balance: 0,
        available_balance: 0,
        locked_balance: 0
      })
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Wallet Created",
      description: `Successfully created ${walletName} wallet`,
    });

    onSuccess?.(wallet);
    setWalletName('');
  } catch (error) {
    console.error('Error creating wallet:', error);
    toast({
      title: "Error",
      description: "Failed to create wallet. Please try again.",
      variant: "destructive",
    });
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="walletName">Wallet Name</Label>
        <Input
          id="walletName"
          placeholder="My Trading Wallet"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Wallet Type</Label>
        <Select onValueChange={(value) => setSelectedType(value as WalletType)}>
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

      <Button type="submit">Create Wallet</Button>
    </form>
  );
};
