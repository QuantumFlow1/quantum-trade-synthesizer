
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface WalletCardProps {
  wallet: {
    id: string;
    name: string;
    type: "spot" | "margin" | "futures";
    balance: number;
    available_balance: number;
    locked_balance: number;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const WalletCard = ({ wallet, isSelected, onClick }: WalletCardProps) => {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
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
  );
};
