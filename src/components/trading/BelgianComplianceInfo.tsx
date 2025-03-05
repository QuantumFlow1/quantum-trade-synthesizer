
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Check, User, ExternalLink } from "lucide-react";
import { useBelgianCompliance } from "./BelgianComplianceProvider";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export const BelgianComplianceInfo = () => {
  const { 
    isSimulationRequired, 
    isQualifiedInvestor, 
    userCountry, 
    updateUserQualifiedStatus,
    checkQualificationStatus 
  } = useBelgianCompliance();
  const { toast } = useToast();
  const [qualificationDialogOpen, setQualificationDialogOpen] = useState(false);
  
  // Only show for Belgian users
  if (userCountry !== "Belgium") {
    return null;
  }
  
  const handleQualificationCheck = async () => {
    try {
      const result = await checkQualificationStatus();
      if (result.success) {
        toast({
          title: "Qualification Verified",
          description: "Your qualified investor status has been updated.",
          duration: 5000,
        });
        setQualificationDialogOpen(false);
      } else {
        toast({
          title: "Verification Failed",
          description: result.message || "Unable to verify qualified investor status at this time.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while checking your qualification status.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
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
          
          <div className="flex gap-2 mb-3">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => setQualificationDialogOpen(true)}
            >
              <User className="w-3 h-3 mr-1" />
              Request Qualified Status
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-xs"
              asChild
            >
              <a href="https://www.fsma.be/en/consumers/investments/investor-profile" target="_blank" rel="noopener noreferrer">
                FSMA Guidelines <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>
          
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
                  <div className="mt-3 p-3 bg-blue-500/10 rounded-md text-blue-600 dark:text-blue-400">
                    <h4 className="font-medium mb-1">Qualification Options:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Individual with certified financial expertise</li>
                      <li>Portfolio value exceeding €500,000</li>
                      <li>Professional entity meeting MiFID II criteria</li>
                    </ul>
                  </div>
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

      <Dialog open={qualificationDialogOpen} onOpenChange={setQualificationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Qualified Investor Verification</DialogTitle>
            <DialogDescription>
              To access full trading features, verify that you meet one of the following qualification criteria:
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="p-3 rounded-md border">
                <h4 className="font-medium mb-1">Financial Expertise</h4>
                <p className="text-sm text-muted-foreground">
                  Certified knowledge of financial markets and trading instruments.
                </p>
              </div>
              
              <div className="p-3 rounded-md border">
                <h4 className="font-medium mb-1">Portfolio Size</h4>
                <p className="text-sm text-muted-foreground">
                  Assets exceeding €500,000 in value and significant trading history.
                </p>
              </div>
              
              <div className="p-3 rounded-md border">
                <h4 className="font-medium mb-1">Professional Entity</h4>
                <p className="text-sm text-muted-foreground">
                  Operating through a company meeting MiFID II professional client criteria.
                </p>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-amber-500">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Verification will require submission of supporting documentation.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setQualificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleQualificationCheck}>
              Verify Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
