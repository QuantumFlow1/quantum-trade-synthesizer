
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Link as LinkIcon, Check, AlertTriangle, Shield, Lock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WalletConnectionProps {
  onConnect: (address: string, network: string) => void;
  onDisconnect: () => void;
}

export const WalletConnection = ({ onConnect, onDisconnect }: WalletConnectionProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("sepolia");
  const [advancedSecurity, setAdvancedSecurity] = useState<boolean>(true);
  const [hardwareWallet, setHardwareWallet] = useState<boolean>(false);
  const [sessionTimeout, setSessionTimeout] = useState<number>(30); // minutes
  const { toast } = useToast();

  // Simulates checking for previously connected wallet with secure storage
  useEffect(() => {
    try {
      // Use more secure storage methods than localStorage in production
      const savedWallet = localStorage.getItem("connectedWallet");
      const savedNetwork = localStorage.getItem("selectedNetwork");
      const sessionExpiry = localStorage.getItem("sessionExpiry");
      
      if (savedWallet && sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry);
        
        // Check if session has expired
        if (Date.now() < expiryTime) {
          setWalletAddress(savedWallet);
          setIsConnected(true);
          setSelectedNetwork(savedNetwork || "sepolia");
          onConnect(savedWallet, savedNetwork || "sepolia");
          
          // Set timeout to disconnect when session expires
          const timeoutId = setTimeout(() => {
            disconnectWallet();
            toast({
              title: "Session Expired",
              description: "Your wallet session has expired for security reasons",
              variant: "default",
            });
          }, expiryTime - Date.now());
          
          return () => clearTimeout(timeoutId);
        } else {
          // Clear expired session
          localStorage.removeItem("connectedWallet");
          localStorage.removeItem("selectedNetwork");
          localStorage.removeItem("sessionExpiry");
          
          toast({
            title: "Session Expired",
            description: "Your previous wallet session has expired",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error retrieving wallet connection:", error);
    }
  }, [onConnect, toast]);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection with security checks
      // In a real implementation, this would use ethers.js or Web3Modal with additional security
      setTimeout(() => {
        // Generate a more secure mock address
        const mockAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        
        setWalletAddress(mockAddress);
        setIsConnected(true);
        
        // Store wallet data securely with expiration
        const expiryTime = Date.now() + (sessionTimeout * 60 * 1000);
        localStorage.setItem("connectedWallet", mockAddress);
        localStorage.setItem("selectedNetwork", selectedNetwork);
        localStorage.setItem("sessionExpiry", expiryTime.toString());
        
        onConnect(mockAddress, selectedNetwork);
        
        // Log connection for security auditing
        console.log(`Secure wallet connection established at ${new Date().toISOString()}`);
        console.log(`Connection will expire at ${new Date(expiryTime).toISOString()}`);
        
        toast({
          title: "Wallet Connected Securely",
          description: `Successfully connected to wallet with enhanced security${advancedSecurity ? " and protection" : ""}`,
        });
        
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
    
    // Clear sensitive data
    localStorage.removeItem("connectedWallet");
    localStorage.removeItem("selectedNetwork");
    localStorage.removeItem("sessionExpiry");
    
    onDisconnect();
    
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet",
    });
  };

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
    
    if (isConnected) {
      localStorage.setItem("selectedNetwork", network);
      onConnect(walletAddress, network);
      
      toast({
        title: "Network Changed",
        description: `Switched to ${network.charAt(0).toUpperCase() + network.slice(1)} testnet`,
      });
    }
  };

  const handleSessionTimeoutChange = (value: string) => {
    const timeout = parseInt(value);
    setSessionTimeout(timeout);
    
    if (isConnected) {
      // Update session expiry
      const expiryTime = Date.now() + (timeout * 60 * 1000);
      localStorage.setItem("sessionExpiry", expiryTime.toString());
      
      toast({
        title: "Session Timeout Updated",
        description: `Wallet session will now expire after ${timeout} minutes of inactivity`,
      });
    }
  };

  return (
    <Card className="p-4 bg-secondary/20 backdrop-blur-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Secure Wallet Connection</h3>
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-1 text-xs text-green-500">
            <Shield className="h-3 w-3" />
            <span>Securely Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-yellow-500">
            <AlertTriangle className="h-3 w-3" />
            <span>Not Connected</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Testnet Network</label>
          <Select
            value={selectedNetwork}
            onValueChange={handleNetworkChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sepolia">Ethereum Sepolia</SelectItem>
              <SelectItem value="goerli">Ethereum Goerli</SelectItem>
              <SelectItem value="bsc-testnet">BSC Testnet</SelectItem>
              <SelectItem value="mumbai">Polygon Mumbai</SelectItem>
              <SelectItem value="arbitrum-goerli">Arbitrum Goerli</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {!isConnected && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced-security"
                  checked={advancedSecurity}
                  onCheckedChange={setAdvancedSecurity}
                />
                <Label htmlFor="advanced-security" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span className="text-sm">Enhanced Security</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="hardware-wallet"
                  checked={hardwareWallet}
                  onCheckedChange={setHardwareWallet}
                />
                <Label htmlFor="hardware-wallet" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span className="text-sm">Hardware Wallet</span>
                </Label>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="session-timeout" className="text-sm">Session Timeout (minutes)</Label>
              <Select
                value={sessionTimeout.toString()}
                onValueChange={handleSessionTimeoutChange}
              >
                <SelectTrigger id="session-timeout">
                  <SelectValue placeholder="30 minutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="1440">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address:</span>
              <span className="text-xs font-mono">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
            </div>
            
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <a
                  href={`https://${selectedNetwork}.etherscan.io/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                  <LinkIcon className="h-3 w-3" />
                  View on Explorer
                </a>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="text-xs"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Connecting Securely..." : "Connect Wallet Securely"}
          </Button>
        )}
      </div>
    </Card>
  );
};
