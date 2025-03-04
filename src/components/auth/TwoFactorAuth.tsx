
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Shield, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TwoFactorAuthProps {
  userId: string;
  isOpen: boolean;
  onVerified: () => void;
  onClose: () => void;
}

export const TwoFactorAuth = ({ userId, isOpen, onVerified, onClose }: TwoFactorAuthProps) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      // In a real implementation, this would verify with your backend
      const { data, error } = await supabase.functions.invoke('verify-2fa', {
        body: { code, userId }
      });

      if (error) throw error;

      if (data?.verified) {
        toast({
          title: "Verification Successful",
          description: "Two-factor authentication verified successfully",
          variant: "success",
        });
        onVerified();
      } else {
        toast({
          title: "Verification Failed",
          description: "The code you entered is incorrect or has expired",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("2FA verification error:", error);
      toast({
        title: "Verification Error",
        description: "Could not verify your authentication code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // In a real implementation, this would request a new code from your backend
      const { error } = await supabase.functions.invoke('send-2fa-code', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your device",
        variant: "success",
      });
    } catch (error) {
      console.error("Error resending 2FA code:", error);
      toast({
        title: "Error",
        description: "Could not send a new verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            For your security, we require two-factor authentication before completing this transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <div>
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
              placeholder="Enter 6-digit code"
              className="font-mono text-center text-lg tracking-widest"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the 6-digit code sent to your registered device
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-500/20 p-1">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <span>Prevents unauthorized access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-500/20 p-1">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <span>Required for high-value transactions</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isResending}
            onClick={handleResendCode}
            className="mb-2 sm:mb-0"
          >
            {isResending ? "Sending..." : "Resend Code"}
          </Button>
          
          <div className="flex space-x-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="button" disabled={isVerifying} onClick={handleVerify}>
              <Shield className="mr-2 h-4 w-4" />
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
