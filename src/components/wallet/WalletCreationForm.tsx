
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface WalletCreationFormProps {
  onCreateWallet: (name: string, type: "spot" | "margin" | "futures") => Promise<void>;
  onCancel: () => void;
}

export const WalletCreationForm = ({ onCreateWallet, onCancel }: WalletCreationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "spot" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateWallet(formData.name, formData.type);
    setFormData({ name: "", type: "spot" });
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            Create Wallet
          </Button>
        </div>
      </form>
    </Card>
  );
};
