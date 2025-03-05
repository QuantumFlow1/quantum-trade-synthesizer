
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Check, User } from "lucide-react";
import { useBelgianCompliance } from "./BelgianComplianceProvider";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const BelgianComplianceInfo = () => {
  const { isSimulationRequired, isQualifiedInvestor, userCountry } = useBelgianCompliance();
  
  // Only show for Belgian users
  if (userCountry !== "Belgium") {
    return null;
  }
  
  return (
    <div className="mb-4">
      {isSimulationRequired ? (
        <div className="p-4 rounded-lg bg-amber-500/15 border border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold">Belgian Regulatory Notice</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Your account is in simulation mode as required by FSMA regulations for retail investors in Belgium. 
            All trades are simulated and will not involve real funds.
          </p>
          
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="info">
              <AccordionTrigger className="text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  More Information
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-muted-foreground mt-2">
                  <p>Under Belgian regulations, trading of certain financial products is restricted:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>CFDs with leverage are prohibited for retail investors</li>
                    <li>Binary options are completely banned</li>
                    <li>Qualified investor status requires verification</li>
                  </ul>
                  <p className="mt-2">
                    Simulation mode allows you to practice trading strategies without risk while 
                    remaining compliant with FSMA regulations.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ) : isQualifiedInvestor ? (
        <div className="p-4 rounded-lg bg-green-500/15 border border-green-500/30">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <Check className="w-5 h-5" />
            <span className="font-bold">Qualified Investor Status</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your account has qualified investor status. All trading features are available to you despite 
            Belgian FSMA regulations for retail investors.
          </p>
        </div>
      ) : null}
    </div>
  );
};
