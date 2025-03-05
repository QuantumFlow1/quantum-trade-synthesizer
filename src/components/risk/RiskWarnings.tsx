
import { AlertTriangle, Info } from "lucide-react";
import { RiskSettings } from "@/types/risk";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface RiskWarningsProps {
  settings: RiskSettings;
}

export const RiskWarnings = ({ settings }: RiskWarningsProps) => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  
  const showFullDisclaimer = () => {
    setExpanded(true);
    toast({
      title: "Full Risk Disclosure",
      description: "The complete risk disclosure has been displayed.",
    });
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Belgian Regulatory Warning - Primary */}
      <div className="p-4 rounded-lg bg-red-500/15 border border-red-500/30">
        <div className="flex items-center gap-2 text-red-500 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold">Belgian Regulatory Warning</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          The FSMA (Financial Services and Markets Authority) prohibits the distribution of certain high-risk 
          financial products like CFDs and binary options to retail investors in Belgium. Trading these products 
          may result in significant financial losses and legal consequences.
        </p>
        {!expanded && (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
            onClick={showFullDisclaimer}
          >
            <Info className="w-4 h-4 mr-2" />
            View Full Risk Disclosure
          </Button>
        )}
      </div>

      {/* Standard Risk Warnings */}
      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">Risk Warnings</span>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Portfolio concentration in BTC above 30%</li>
          <li>• Margin usage approaching limit</li>
          {settings.daily_loss_notification && (
            <li>• Daily loss limit: ${settings.max_daily_loss}</li>
          )}
        </ul>
      </div>

      {/* Expanded Belgian Compliance Information */}
      {expanded && (
        <div className="p-4 rounded-lg bg-secondary/20 border border-secondary/30">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4" />
            <span className="font-medium">Belgian Compliance Requirements</span>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Under Belgian law:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Trading CFDs with leverage is prohibited for retail investors</li>
              <li>Binary options are completely banned</li>
              <li>Financial service providers must verify investor qualification</li>
              <li>Brokers must provide mandatory risk warnings and disclosures</li>
              <li>Negative balance protection is mandatory for all accounts</li>
              <li>Certain bonus offers and promotions are prohibited</li>
            </ul>
            <p className="mt-3 font-medium">
              This platform is currently configured in simulation mode only for Belgian retail investors, 
              with real trading features disabled to comply with FSMA regulations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
