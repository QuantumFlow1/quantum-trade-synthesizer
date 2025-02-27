
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, ArrowDownRight, Copy, QrCode, RefreshCw, AlertTriangle, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  
  // Format address for display
  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.substring(0, 12)}...${address.substring(address.length - 4)}`;
  };
  
  // Generate a random security code
  const generateSecurityCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Mock currency list with attributes
  const currencies = [
    { symbol: "BTC", name: "Bitcoin", network: "Bitcoin", min: 0.0001, max: 10 },
    { symbol: "ETH", name: "Ethereum", network: "Ethereum", min: 0.001, max: 100 },
    { symbol: "USDT", name: "Tether", network: "ERC-20", min: 10, max: 100000 },
    { symbol: "USDC", name: "USD Coin", network: "ERC-20", min: 10, max: 100000 },
  ];
  
  // Find selected currency details
  const selectedCurrencyDetails = currencies.find(c => c.symbol === selectedCurrency);
  
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
          <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-currency">Select Currency</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger id="deposit-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        <div className="flex items-center gap-2">
                          <span>{currency.symbol}</span>
                          <span className="text-xs text-muted-foreground">({currency.name})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCurrencyDetails && (
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span>{selectedCurrencyDetails.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Deposit:</span>
                    <span>{selectedCurrencyDetails.min} {selectedCurrencyDetails.symbol}</span>
                  </div>
                </div>
              )}
              
              <Alert variant="warning" className="bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Only send {selectedCurrency} to this address. Sending any other cryptocurrency may result in permanent loss.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="receive-address">Your {selectedCurrency} Deposit Address</Label>
                <div className="flex">
                  <Input 
                    id="receive-address" 
                    value={myWalletAddress}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(myWalletAddress)}
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="ml-2"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {showQRCode && (
                <div className="flex justify-center p-4 bg-white rounded-md">
                  {/* Mock QR code - in a real app, use a proper QR code generator */}
                  <div className="w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iNDAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjgwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTAwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTQwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTYwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMjAiIHk9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjgwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTIwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTYwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjEwMCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjEyMCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjE2MCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjIwIiB5PSI4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iNDAiIHk9IjgwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjEwMCIgeT0iODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjE2MCIgeT0iODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjIwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjYwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjgwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjE0MCIgeT0iMTAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIyMCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI0MCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI4MCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIxMDAiIHk9IjEyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTIwIiB5PSIxMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjE0MCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIxNjAiIHk9IjEyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iNDAiIHk9IjE0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iNjAiIHk9IjE0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTAwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjEyMCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIyMCIgeT0iMTYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iMTYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI4MCIgeT0iMTYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIxMDAiIHk9IjE2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTQwIiB5PSIxNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjwvc3ZnPg==')] bg-contain"></div>
                </div>
              )}
              
              <div className="flex justify-center">
                <Button onClick={handleDeposit}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New Address
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="withdraw" className="space-y-4 pt-4">
          <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-currency">Select Currency</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger id="withdraw-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        <div className="flex items-center gap-2">
                          <span>{currency.symbol}</span>
                          <span className="text-xs text-muted-foreground">({currency.name})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
              
              {selectedCurrencyDetails && (
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span>{selectedCurrencyDetails.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Withdrawal:</span>
                    <span>{selectedCurrencyDetails.min} {selectedCurrencyDetails.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Withdrawal:</span>
                    <span>{selectedCurrencyDetails.max} {selectedCurrencyDetails.symbol}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="security-level">Security Level</Label>
                <Select value={securityLevel} onValueChange={setSecurityLevel}>
                  <SelectTrigger id="security-level">
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Faster)</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High (Recommended)</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <Shield className="h-3 w-3 mr-1" />
                  {securityLevel === "high" ? (
                    "High security requires additional verification but provides maximum protection"
                  ) : securityLevel === "medium" ? (
                    "Medium security balances speed and protection"
                  ) : (
                    "Low security is faster but offers minimal protection"
                  )}
                </div>
              </div>
              
              {securityLevel !== "low" && (
                <div className="p-3 border rounded-md bg-secondary/10">
                  <div className="text-sm font-medium mb-2">Security Verification</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    For your security, a verification code has been sent to your registered email or phone.
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-mono font-bold">{generateSecurityCode()}</div>
                    <Button variant="outline" size="sm" className="text-xs">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Resend Code
                    </Button>
                  </div>
                </div>
              )}
              
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
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
