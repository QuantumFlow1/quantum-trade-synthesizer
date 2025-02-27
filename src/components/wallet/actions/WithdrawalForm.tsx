
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WithdrawalFormProps {
  amount: string;
  setAmount: (value: string) => void;
  sendAddress: string;
  setSendAddress: (value: string) => void;
  selectedCurrency: string;
  isProcessing: boolean;
  handleWithdraw: () => void;
  isValidAmount: (value: string) => boolean;
  isValidAddress: (value: string) => boolean;
}

export const WithdrawalForm = ({
  amount,
  setAmount,
  sendAddress,
  setSendAddress,
  selectedCurrency,
  isProcessing,
  handleWithdraw,
  isValidAmount,
  isValidAddress
}: WithdrawalFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder={`Enter ${selectedCurrency} amount`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="send-address">Destination Address</Label>
        <Input
          id="send-address"
          placeholder={`Enter ${selectedCurrency} address`}
          value={sendAddress}
          onChange={(e) => setSendAddress(e.target.value)}
          className="font-mono text-sm"
        />
      </div>
      
      <Alert variant="warning" className="bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please double-check the destination address. Transactions cannot be reversed once processed.
        </AlertDescription>
      </Alert>
      
      <Button 
        onClick={handleWithdraw}
        disabled={isProcessing || !isValidAmount(amount) || !isValidAddress(sendAddress)}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Withdraw {selectedCurrency}
          </>
        )}
      </Button>
    </>
  );
};
