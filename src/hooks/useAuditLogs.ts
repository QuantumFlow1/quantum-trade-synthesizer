
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { logApiCall } from "@/utils/apiLogger";
import { toast } from "@/components/ui/use-toast";
import { type TransactionAudit, type User } from "@/components/admin/audit/types";

export type AuditLogFilter = {
  userId: string;
  transactionType: string;
  status: string;
  highValueOnly: boolean;
  required2faOnly: boolean;
  dateFrom: string;
  dateTo: string;
  search: string;
};

export const useAuditLogs = () => {
  const [audits, setAudits] = useState<TransactionAudit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AuditLogFilter>({
    userId: "",
    transactionType: "",
    status: "",
    highValueOnly: false,
    required2faOnly: false,
    dateFrom: "",
    dateTo: "",
    search: ""
  });

  useEffect(() => {
    loadAuditLogs();
    loadUsers();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await logApiCall('transaction_audits/fetch', 'TransactionAuditLog', 'pending');
      
      const { data, error } = await supabase
        .from('transaction_audits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        await logApiCall('transaction_audits/fetch', 'TransactionAuditLog', 'error', error.message);
        setError(`Failed to load audit logs: ${error.message}`);
        throw error;
      }
      
      console.log("Loaded audit logs:", data?.length || 0);
      setAudits(data || []);
      await logApiCall('transaction_audits/fetch', 'TransactionAuditLog', 'success');
    } catch (error: any) {
      console.error("Error loading audit logs:", error);
      toast({
        title: "Error",
        description: "Failed to load transaction audit logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      await logApiCall('profiles/fetch', 'TransactionAuditLog', 'pending');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email');

      if (error) {
        await logApiCall('profiles/fetch', 'TransactionAuditLog', 'error', error.message);
        console.error("Error loading users:", error);
        return;
      }
      
      setUsers(data || []);
      await logApiCall('profiles/fetch', 'TransactionAuditLog', 'success');
    } catch (error: any) {
      console.error("Error loading users:", error);
    }
  };

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await logApiCall('transaction_audits/filter', 'TransactionAuditLog', 'pending');
      
      let query = supabase
        .from('transaction_audits')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter.userId) {
        query = query.eq('user_id', filter.userId);
      }

      if (filter.transactionType) {
        query = query.eq('transaction_type', filter.transactionType);
      }

      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      if (filter.highValueOnly) {
        query = query.eq('high_value', true);
      }

      if (filter.required2faOnly) {
        query = query.eq('required_2fa', true);
      }

      if (filter.dateFrom) {
        query = query.gte('created_at', filter.dateFrom);
      }

      if (filter.dateTo) {
        // Add one day to include the end date
        const endDate = new Date(filter.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }

      if (filter.search) {
        query = query.or(
          `asset_symbol.ilike.%${filter.search}%,source_ip.ilike.%${filter.search}%`
        );
      }

      const { data, error } = await query.limit(100);

      if (error) {
        await logApiCall('transaction_audits/filter', 'TransactionAuditLog', 'error', error.message);
        setError(`Failed to filter logs: ${error.message}`);
        throw error;
      }
      
      setAudits(data || []);
      await logApiCall('transaction_audits/filter', 'TransactionAuditLog', 'success');
    } catch (error: any) {
      console.error("Error applying filters:", error);
      toast({
        title: "Error",
        description: "Failed to filter transaction audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilter({
      userId: "",
      transactionType: "",
      status: "",
      highValueOnly: false,
      required2faOnly: false,
      dateFrom: "",
      dateTo: "",
      search: ""
    });
    loadAuditLogs();
  };

  const exportToCSV = () => {
    if (audits.length === 0) {
      toast({
        title: "No Data",
        description: "There are no audit logs to export",
        variant: "warning",
      });
      return;
    }

    try {
      // Create CSV headers
      const headers = [
        "ID",
        "User ID",
        "Transaction Type",
        "Asset Symbol",
        "Amount",
        "Price",
        "Value",
        "High Value",
        "Required 2FA",
        "Source IP",
        "Status",
        "Timestamp"
      ];

      // Convert data to CSV rows
      const rows = audits.map(audit => [
        audit.id,
        audit.user_id,
        audit.transaction_type,
        audit.asset_symbol,
        audit.amount,
        audit.price,
        audit.value,
        audit.high_value ? "Yes" : "No",
        audit.required_2fa ? "Yes" : "No",
        audit.source_ip,
        audit.status,
        new Date(audit.created_at).toLocaleString()
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `transaction_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "Audit logs have been exported to CSV",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export audit logs to CSV",
        variant: "destructive",
      });
    }
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : userId;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return {
    audits,
    users,
    loading,
    error,
    filter,
    setFilter,
    loadAuditLogs,
    applyFilters,
    resetFilters,
    exportToCSV,
    getUserEmail,
    formatDate
  };
};
