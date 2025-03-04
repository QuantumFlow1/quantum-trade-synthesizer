
import { Label } from "@/components/ui/label";
import { Shield, RefreshCw, AlertTriangle } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuthActions } from "@/hooks/use-auth-actions";

interface SecuritySelectorProps {
  securityLevel: string;
  setSecurityLevel: (value: string) => void;
  generateSecurityCode: () => string;
}

export const SecuritySelector = ({ 
  securityLevel, 
  setSecurityLevel,
  generateSecurityCode
}: SecuritySelectorProps) => {
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [securityCode, setSecurityCode] = useState(() => generateSecurityCode());
  const [countdown, setCountdown] = useState(0);
  const [codeExpiresAt, setCodeExpiresAt] = useState<string | null>(null);
  const [securityStatus, setSecurityStatus] = useState<string | null>(null);
  const { toast } = useToast();
  const { securityService } = useAuthActions();
  
  // Start countdown timer when code is sent
  useEffect(() => {
    if (!codeExpiresAt) return;
    
    const expiryTime = new Date(codeExpiresAt).getTime();
    const now = new Date().getTime();
    const initialCountdown = Math.max(0, Math.floor((expiryTime - now) / 1000));
    
    setCountdown(initialCountdown);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [codeExpiresAt]);
  
  // Format countdown as MM:SS
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Call the security service to send a 2FA code
      const data = await securityService.send2FACode(user.id);
      
      if (data?.expiresAt) {
        setCodeExpiresAt(data.expiresAt);
      }
      
      // Generate a new display code (this is just for UI)
      setSecurityCode(generateSecurityCode());
      
      toast({
        title: "Verification Code Sent",
        description: "A new verification code has been sent to your registered contact method.",
      });
      
      // Also check account security
      const securityData = await securityService.checkAccountSecurity(user.id);
      if (securityData) {
        setSecurityStatus(securityData.securityStatus);
      }
      
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast({
        title: "Failed to Send Code",
        description: "There was a problem sending your verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };
  
  const handleVerifyCode = async () => {
    setIsVerifying(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // In a real app, we would get the code from user input
      // Here we're simulating a verification with the mocked code
      const isVerified = await securityService.verify2FACode(user.id, "123456");
      
      if (isVerified) {
        toast({
          title: "Verification Successful",
          description: "Your account has been successfully verified.",
        });
        
        setSecurityStatus("verified");
      } else {
        toast({
          title: "Verification Failed",
          description: "The code you entered is invalid or has expired. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Check account security status when component mounts
  useEffect(() => {
    const checkSecurity = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const securityData = await securityService.checkAccountSecurity(user.id);
          if (securityData) {
            setSecurityStatus(securityData.securityStatus);
          }
        }
      } catch (error) {
        console.error("Error checking security status:", error);
      }
    };
    
    checkSecurity();
  }, [securityService]);

  return (
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

      {securityLevel !== "low" && (
        <div className="p-3 border rounded-md bg-secondary/10">
          <div className="text-sm font-medium mb-2">Security Verification</div>
          <div className="text-xs text-muted-foreground mb-2">
            For your security, a verification code has been sent to your registered email or phone.
          </div>
          
          {securityStatus === "locked" && (
            <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded flex items-center text-xs text-red-500">
              <AlertTriangle size={12} className="mr-1" />
              Your account is currently locked due to suspicious activity. Please contact support.
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="font-mono font-bold">{securityCode}</div>
            <div className="flex items-center gap-2">
              {countdown > 0 && (
                <span className="text-xs text-muted-foreground">
                  Expires in {formatCountdown(countdown)}
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={handleResendCode}
                disabled={isResending || countdown > 0}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? "Sending..." : countdown > 0 ? "Wait" : "Resend Code"}
              </Button>
            </div>
          </div>
          
          {securityLevel === "high" && securityStatus !== "verified" && (
            <div className="mt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                onClick={handleVerifyCode}
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify Account"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
