
import { Users, Database, Activity, AlertTriangle } from "lucide-react";

interface SuperAdminMonitorProps {
  userCount: number;
  systemLoad: number;
  errorRate: number;
}

const SuperAdminMonitor = ({ userCount, systemLoad, errorRate }: SuperAdminMonitorProps) => {
  return (
    <div className="mb-6 p-4 bg-secondary/10 rounded-lg border border-secondary">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Database className="w-5 h-5" />
        Super Admin Monitor
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" />
            <span className="font-medium">Actieve Gebruikers</span>
          </div>
          <div className="text-2xl font-bold">{userCount}</div>
        </div>
        <div className="p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium">Systeem Belasting</span>
          </div>
          <div className="text-2xl font-bold">{systemLoad}%</div>
        </div>
        <div className="p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Error Rate</span>
          </div>
          <div className="text-2xl font-bold">{errorRate}%</div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminMonitor;
