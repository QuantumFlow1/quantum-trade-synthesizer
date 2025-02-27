
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepositTab } from "./actions/DepositTab";
import { WithdrawalTab } from "./actions/WithdrawalTab";
import { Currency } from "./actions/CurrencySelector";

export const WalletActions = () => {
  const [activeTab, setActiveTab] = useState<string>("deposit");
  const [amount, setAmount] = useState<string>("");
  const [receiveAddress, setReceiveAddress] = useState<string>("");
  const [sendAddress, setSendAddress] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("BTC");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [securityLevel, setSecurityLevel] = useState<string>("high");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  // Mock wallet address
  const myWalletAddress = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t";
  
  // Validate input amount
  const isValidAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue > 0;
  };
  
  // Validate address format (simplified)
  const isValidAddress = (address: string): boolean => {
    return address.trim().length >= 26 && address.trim().length <= 42;
  };
  
  const handleDeposit = () => {
    setShowQRCode(true);
    toast({
      title: "Deposit Address Ready",
      description: "Scan the QR code or copy the address to make a deposit",
    });
  };
  
  const handleWithdraw = () => {
    if (!isValidAmount(amount)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValidAddress(sendAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid withdrawal address",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setAmount("");
      setSendAddress("");
      
      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal of ${amount} ${selectedCurrency} has been initiated and is being processed.`,
      });
    }, 2000);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };
  
  // Generate a random security code
  const generateSecurityCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Mock currency list with attributes
  const currencies: Currency[] = [
    { symbol: "BTC", name: "Bitcoin", network: "Bitcoin", min: 0.0001, max: 10 },
    { symbol: "ETH", name: "Ethereum", network: "Ethereum", min: 0.001, max: 100 },
    { symbol: "USDT", name: "Tether", network: "ERC-20", min: 10, max: 100000 },
    { symbol: "USDC", name: "USD Coin", network: "ERC-20", min: 10, max: 100000 },
  ];
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="deposit" className="flex items-center gap-1">
            <ArrowDownRight className="h-4 w-4" />
            Deposit
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4" />
            Withdraw
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposit" className="space-y-4 pt-4">
          <DepositTab
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            currencies={currencies}
            walletAddress={myWalletAddress}
            copyToClipboard={copyToClipboard}
            showQRCode={showQRCode}
            setShowQRCode={setShowQRCode}
            handleDeposit={handleDeposit}
          />
        </TabsContent>
        
        <TabsContent value="withdraw" className="space-y-4 pt-4">
          <WithdrawalTab
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            currencies={currencies}
            amount={amount}
            setAmount={setAmount}
            sendAddress={sendAddress}
            setSendAddress={setSendAddress}
            securityLevel={securityLevel}
            setSecurityLevel={setSecurityLevel}
            isProcessing={isProcessing}
            handleWithdraw={handleWithdraw}
            isValidAmount={isValidAmount}
            isValidAddress={isValidAddress}
            generateSecurityCode={generateSecurityCode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
