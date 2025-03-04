
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
            <div className="font-mono font-bold">{generateSecurityCode()}</div>
            <Button variant="outline" size="sm" className="text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Resend Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
