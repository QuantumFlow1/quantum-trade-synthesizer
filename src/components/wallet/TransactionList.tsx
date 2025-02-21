import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  description?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onCreateTransaction: (type: "deposit" | "withdrawal", amount: string) => Promise<void>;
}

export const TransactionList = ({ transactions, onCreateTransaction }: TransactionListProps) => {
  const [formData, setFormData] = useState({
    amount: "",
    transactionType: "deposit" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateTransaction(formData.transactionType, formData.amount);
    setFormData({ ...formData, amount: "" });
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Transactions</h3>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
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
  );
};
