
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TradeOrder } from "../types";
import { TwoFactorAuth } from "@/components/auth/TwoFactorAuth";
import { 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Shield 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";

interface DetailedOrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  order: TradeOrder;
  asset: {
    name: string;
    symbol: string;
    currentPrice: number;
    high24h?: number;
    low24h?: number;
    change24h?: number;
  };
}

export const DetailedOrderConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  asset,
}: DetailedOrderConfirmationProps) => {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [showRiskWarning, setShowRiskWarning] = useState(false);
  const [showKycWarning, setShowKycWarning] = useState(false);
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);
  
  const orderValue = order.amount * (order.price || asset.currentPrice);
  const isHighValueOrder = orderValue > 10000; // Example threshold for high-value orders

  // Check if the order needs 2FA verification based on value or other risk factors
  const checkOrderRequirements = async () => {
    if (!user) return;
    
    setIsChecking(true);
    try {
      // Check for KYC verification status
      const { data: kycData, error: kycError } = await supabase
        .from('user_kyc')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (kycError) throw kycError;
      
      // In a real implementation, check different KYC levels
      const isKycComplete = kycData?.status === 'verified';
      setIsKycVerified(isKycComplete);
      
      if (!isKycComplete) {
        setShowKycWarning(true);
        return;
      }

      // Check if the order exceeds thresholds that require additional verification
      if (isHighValueOrder) {
        setShow2FA(true);
        return;
      }
      
      // Check if the order is unusually risky
      if (order.type === "sell" && asset.change24h && asset.change24h < -10) {
        setShowRiskWarning(true);
        return;
      }
      
      // If all checks pass, proceed with the order
      handleConfirm();
    } catch (error) {
      console.error("Error checking order requirements:", error);
      toast({
        title: "Verification Error",
        description: "Could not verify order requirements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleConfirm = async () => {
    if (isHighValueOrder && !is2FAVerified) {
      setShow2FA(true);
      return;
    }
    
    try {
      // In a real implementation, we would log this transaction for audit purposes
      await supabase.functions.invoke('log-transaction-audit', {
        body: { 
          userId: user?.id,
          orderType: order.type,
          assetSymbol: asset.symbol,
          amount: order.amount,
          price: order.price || asset.currentPrice,
          value: orderValue,
          isHighValue: isHighValueOrder,
          required2FA: show2FA
        }
      });
      
      // Proceed with order confirmation
      onConfirm();
      
      toast({
        title: "Order Successful",
        description: `Your ${order.type} order for ${order.amount} ${asset.symbol} has been submitted`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Order Error",
        description: "Could not process your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTwoFactorVerified = () => {
    setIs2FAVerified(true);
    setShow2FA(false);
    handleConfirm();
  };

  const orderTypeColor = order.type === "buy" ? "text-green-600" : "text-red-600";
  const orderTypeClass = order.type === "buy" ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20";
  const orderValueClass = orderValue > 5000 ? "text-yellow-600 font-semibold" : "";

  if (show2FA) {
    return (
      <TwoFactorAuth
        userId={user?.id || ''}
        isOpen={true}
        onVerified={handleTwoFactorVerified}
        onClose={() => setShow2FA(false)}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm {order.type.toUpperCase()} Order</DialogTitle>
          <DialogDescription>
            Please review and confirm your order details before proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {showKycWarning && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-400">
                <p className="font-medium">KYC Verification Required</p>
                <p>Complete your identity verification to access advanced trading features.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => {
                    onClose();
                    // In a real implementation, this would navigate to the KYC verification page
                  }}
                >
                  Complete Verification
                </Button>
              </div>
            </div>
          )}

          {showRiskWarning && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800 dark:text-orange-400">
                <p className="font-medium">Market Volatility Warning</p>
                <p>This asset is currently experiencing high volatility (24h change: {asset.change24h}%). Proceed with caution.</p>
              </div>
            </div>
          )}

          <div className="rounded-lg border p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-muted-foreground">Order Type</span>
              <span className={`${orderTypeColor} font-medium px-2 py-0.5 rounded ${orderTypeClass}`}>
                {order.type.toUpperCase()} {order.orderType.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-muted-foreground">Asset</span>
              <span className="font-medium">{asset.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-muted-foreground">Amount</span>
              <span className="font-medium">{order.amount} {asset.symbol.split('/')[0]}</span>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-muted-foreground">Price</span>
              <span className="font-medium">${(order.price || asset.currentPrice).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-sm font-medium">Estimated Value</span>
              <span className={`font-semibold ${orderValueClass}`}>${orderValue.toFixed(2)}</span>
            </div>
          </div>

          {order.stopLoss && (
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-muted-foreground">Stop Loss</span>
              <span className="font-medium">${order.stopLoss}</span>
            </div>
          )}
          
          {order.takeProfit && (
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-muted-foreground">Take Profit</span>
              <span className="font-medium">${order.takeProfit}</span>
            </div>
          )}

          <div className="flex flex-col space-y-2 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Your order will be executed at the best available price</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Market orders are typically executed immediately</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <span>Trading fees will be calculated at execution</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-purple-500" />
              <span>This transaction is protected by our security protocols</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          <Button
            type="button"
            className={order.type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            onClick={checkOrderRequirements}
            disabled={isChecking}
          >
            {isChecking ? (
              "Verifying..."
            ) : (
              <>
                Confirm {order.type.toUpperCase()}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
