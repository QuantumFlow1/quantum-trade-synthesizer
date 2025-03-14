
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactionAuditWithRules } from '@/hooks/useTransactionAuditWithRules';
import { type TransactionType } from '@/utils/transactionAuditLogger';
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const AuditRulesDemo = () => {
  const [transactionType, setTransactionType] = useState<TransactionType>('buy');
  const [assetSymbol, setAssetSymbol] = useState('BTC');
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(30000);
  
  const { 
    auditTransactionWithRules, 
    lastTriggeredRules, 
    isLogging 
  } = useTransactionAuditWithRules();
  
  const handleAudit = async () => {
    try {
      const success = await auditTransactionWithRules(
        transactionType,
        assetSymbol,
        amount,
        price
      );
      
      if (success) {
        toast({
          title: "Transaction Audited",
          description: lastTriggeredRules.length > 0 
            ? `Rules triggered: ${lastTriggeredRules.join(', ')}` 
            : "No special rules were triggered",
        });
      } else {
        toast({
          title: "Audit Failed",
          description: "Failed to audit transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error auditing transaction:', error);
      toast({
        title: "Error",
        description: "An error occurred while auditing the transaction",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Audit Rules Demo</CardTitle>
        <CardDescription>
          Test the audit rule engine by simulating different transaction types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select 
                value={transactionType} 
                onValueChange={(value) => setTransactionType(value as TransactionType)}
              >
                <SelectTrigger id="transaction-type">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="asset-symbol">Asset Symbol</Label>
              <Input 
                id="asset-symbol" 
                value={assetSymbol} 
                onChange={(e) => setAssetSymbol(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="border p-4 rounded bg-muted/20">
            <p className="text-sm font-medium mb-2">Transaction Value: ${(amount * price).toLocaleString()}</p>
            {lastTriggeredRules.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Rules Triggered:</p>
                <ul className="text-sm list-disc list-inside">
                  {lastTriggeredRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Button disabled={isLogging} onClick={handleAudit}>
            {isLogging ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Auditing...
              </>
            ) : (
              "Audit Transaction"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
