
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { getUserRoleInfo } from "@/utils/auth-utils";

type ComplianceContextType = {
  isSimulationRequired: boolean;
  isQualifiedInvestor: boolean;
  complianceLoaded: boolean;
  userCountry: string | null;
};

const ComplianceContext = createContext<ComplianceContextType>({
  isSimulationRequired: false,
  isQualifiedInvestor: false,
  complianceLoaded: false,
  userCountry: null,
});

export const useBelgianCompliance = () => useContext(ComplianceContext);

interface BelgianComplianceProviderProps {
  children: React.ReactNode;
}

export const BelgianComplianceProvider = ({ children }: BelgianComplianceProviderProps) => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [isSimulationRequired, setIsSimulationRequired] = useState(false);
  const [isQualifiedInvestor, setIsQualifiedInvestor] = useState(false);
  const [complianceLoaded, setComplianceLoaded] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const userRoleInfo = getUserRoleInfo(userProfile);

  useEffect(() => {
    const checkComplianceRequirements = async () => {
      // If user isn't authenticated, don't proceed
      if (!user) {
        setComplianceLoaded(true);
        return;
      }

      try {
        // 1. Check if user is from Belgium (could be stored in profile or fetched)
        // In a real implementation, this would come from KYC or user profile data
        const storedCountry = localStorage.getItem("userCountry") || "Belgium";
        setUserCountry(storedCountry);
        
        const isBelgianUser = storedCountry === "Belgium";
        
        // 2. Check if user is a qualified investor (beyond retail)
        // In a real implementation, this would be determined through proper KYC
        const isQualified = userRoleInfo.isLovTrader || userRoleInfo.isAdmin;
        setIsQualifiedInvestor(isQualified);
        
        // 3. Determine if simulation is required based on country and investor qualification
        const requiresSimulation = isBelgianUser && !isQualified;
        setIsSimulationRequired(requiresSimulation);
        
        // 4. Show appropriate notice if simulation is required
        if (requiresSimulation) {
          toast({
            title: "Belgian Investor Notice",
            description: "Due to FSMA regulations, your account is in simulation mode. Real trading features are disabled for retail investors in Belgium.",
            duration: 6000,
          });
        }
        
        setComplianceLoaded(true);
      } catch (error) {
        console.error("Error checking compliance requirements:", error);
        // Default to safest option in case of error
        setIsSimulationRequired(true);
        setComplianceLoaded(true);
      }
    };

    checkComplianceRequirements();
  }, [user, userProfile, toast, userRoleInfo]);

  return (
    <ComplianceContext.Provider
      value={{
        isSimulationRequired,
        isQualifiedInvestor,
        complianceLoaded,
        userCountry
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};
