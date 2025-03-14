
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Shield } from "lucide-react";
import { AuditLogFilters } from "./audit/AuditLogFilters";
import { AuditLogTable } from "./audit/AuditLogTable";
import { EmptyOrErrorState } from "./audit/EmptyOrErrorState";
import { useAuditLogs } from "@/hooks/useAuditLogs";

export const TransactionAuditLog = () => {
  const {
    audits,
    loading,
    error,
    filter,
    setFilter,
    users,
    loadAuditLogs,
    applyFilters,
    resetFilters,
    exportToCSV,
    getUserEmail,
    formatDate
  } = useAuditLogs();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Transaction Audit Log
            </CardTitle>
            <CardDescription>
              View and analyze all trading transactions for regulatory compliance and security monitoring
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAuditLogs} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <AuditLogFilters 
            filter={filter}
            setFilter={setFilter}
            users={users}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
            exportToCSV={exportToCSV}
          />
          
          <EmptyOrErrorState 
            error={error} 
            isEmpty={!loading && audits.length === 0} 
          />
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            audits.length > 0 && (
              <AuditLogTable 
                audits={audits}
                getUserEmail={getUserEmail}
                formatDate={formatDate}
              />
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
