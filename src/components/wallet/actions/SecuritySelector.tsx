
import { Label } from "@/components/ui/label";
import { Shield, RefreshCw } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [securityCode, setSecurityCode] = useState(() => generateSecurityCode());
  
  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Call the combined security-services function with the appropriate action
      const { data, error } = await supabase.functions.invoke('security-services', {
        body: { 
          action: 'send_2fa_code',
          userId: user.id
        }
      });
      
      if (error) throw error;
      
      // Generate a new display code
      setSecurityCode(generateSecurityCode());
      
      toast({
        title: "Verification Code Sent",
        description: "A new verification code has been sent to your registered contact method.",
      });
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
          <div className="flex justify-between items-center">
            <div className="font-mono font-bold">{securityCode}</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={handleResendCode}
              disabled={isResending}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isResending ? 'animate-spin' : ''}`} />
              Resend Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
