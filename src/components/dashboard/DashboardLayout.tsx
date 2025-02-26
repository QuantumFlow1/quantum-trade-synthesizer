
import { ReactNode } from "react";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { DashboardSettings } from "../DashboardSettings";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <DashboardProvider>
      <div className="min-h-screen p-6 space-y-6 bg-gradient-to-br from-background via-background/95 to-background/90">
        <DashboardSettings />
        {children}
      </div>
    </DashboardProvider>
  );
};
