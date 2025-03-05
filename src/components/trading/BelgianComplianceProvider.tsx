
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { getUserRoleInfo } from "@/utils/auth-utils";

type ComplianceContextType = {
  isSimulationRequired: boolean;
  isQualifiedInvestor: boolean;
  complianceLoaded: boolean;
  userCountry: string | null;
  updateUserQualifiedStatus: (isQualified: boolean) => Promise<{success: boolean, message?: string}>;
  checkQualificationStatus: () => Promise<{success: boolean, message?: string}>;
};

const ComplianceContext = createContext<ComplianceContextType>({
  isSimulationRequired: false,
  isQualifiedInvestor: false,
  complianceLoaded: false,
  userCountry: null,
  updateUserQualifiedStatus: async () => ({success: false}),
  checkQualificationStatus: async () => ({success: false}),
});

export const useBelgianCompliance = () => useContext(ComplianceContext);

interface BelgianComplianceProviderProps {
  children: React.ReactNode;
}

export const BelgianComplianceProvider = ({ children }: BelgianComplianceProviderProps) => {
  const { user, userProfile } = useAuth() || { user: null, userProfile: null };
  const { toast } = useToast();
  const [isSimulationRequired, setIsSimulationRequired] = useState(false);
  const [isQualifiedInvestor, setIsQualifiedInvestor] = useState(false);
  const [complianceLoaded, setComplianceLoaded] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const userRoleInfo = userProfile ? getUserRoleInfo(userProfile) : { isLovTrader: false, isAdmin: false };

  // Function to update user's qualified status
  const updateUserQualifiedStatus = async (isQualified: boolean): Promise<{success: boolean, message?: string}> => {
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }
    
    try {
      // In a real implementation, this would call an API endpoint to update the user's status
      // For this demo, we'll simulate a successful update
      setIsQualifiedInvestor(isQualified);
      setIsSimulationRequired(!isQualified);
      
      // Save to local storage for persistence (in real app, this would be saved to database)
      localStorage.setItem("userQualifiedStatus", isQualified ? "true" : "false");
      
      return { 
        success: true, 
        message: "Qualification status updated successfully" 
      };
    } catch (error) {
      console.error("Error updating qualified status:", error);
      return { 
        success: false, 
        message: "Failed to update qualification status" 
      };
    }
  };
  
  // Function to check if user meets qualification criteria
  const checkQualificationStatus = async (): Promise<{success: boolean, message?: string}> => {
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }
    
    try {
      // In a real implementation, this would verify the user's documentation and qualifications
      // For this demo, we'll simulate the verification process with a success
      
      // Add a short delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the user's qualified status
      const result = await updateUserQualifiedStatus(true);
      
      toast({
        title: "Qualification Successful",
        description: "Your account has been verified as a qualified investor.",
      });
      
      return result;
    } catch (error) {
      console.error("Error checking qualification status:", error);
      return { 
        success: false, 
        message: "Verification process failed. Please try again later." 
      };
    }
  };

  useEffect(() => {
    const checkComplianceRequirements = async () => {
      try {
        // If user isn't authenticated, don't proceed with compliance checks
        if (!user) {
          setComplianceLoaded(true);
          return;
        }

        // 1. Check if user is from Belgium (could be stored in profile or fetched)
        // In a real implementation, this would come from KYC or user profile data
        const storedCountry = localStorage.getItem("userCountry") || "Belgium";
        setUserCountry(storedCountry);
        
        const isBelgianUser = storedCountry === "Belgium";
        
        // 2. Check if user is a qualified investor (beyond retail)
        // First check stored preference, then role
        const storedQualifiedStatus = localStorage.getItem("userQualifiedStatus");
        const isQualified = storedQualifiedStatus === "true" || userRoleInfo.isLovTrader || userRoleInfo.isAdmin;
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
      } catch (error) {
        console.error("Error checking compliance requirements:", error);
        // Default to safest option in case of error
        setIsSimulationRequired(true);
      } finally {
        // Always mark as loaded even if there was an error
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
        userCountry,
        updateUserQualifiedStatus,
        checkQualificationStatus
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};
