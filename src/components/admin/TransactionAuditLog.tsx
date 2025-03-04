
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, Search, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface TransactionAudit {
  id: string;
  user_id: string;
  transaction_type: string;
  asset_symbol: string;
  amount: number;
  price: number;
  value: number;
  high_value: boolean;
  required_2fa: boolean;
  source_ip: string;
  user_agent: string;
  status: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
}

export const TransactionAuditLog = () => {
  const [audits, setAudits] = useState<TransactionAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState({
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
    try {
      const { data, error } = await supabase
        .from('transaction_audits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAudits(data || []);
    } catch (error) {
      console.error("Error loading audit logs:", error);
      toast({
        title: "Error",
        description: "Failed to load transaction audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
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

      if (error) throw error;
      setAudits(data || []);
    } catch (error) {
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
    } catch (error) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Transaction Audit Log
        </CardTitle>
        <CardDescription>
          View and analyze all trading transactions for regulatory compliance and security monitoring
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search asset, IP..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="w-full"
              />
              <Button size="icon" variant="outline" onClick={applyFilters}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Select
                value={filter.transactionType}
                onValueChange={(value) => setFilter({ ...filter, transactionType: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filter.status}
                onValueChange={(value) => setFilter({ ...filter, status: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                Reset
              </Button>
              <Button onClick={exportToCSV} className="flex items-center gap-2 flex-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={filter.dateFrom}
                onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={filter.dateTo}
                onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="highValueOnly"
                checked={filter.highValueOnly}
                onChange={(e) => setFilter({ ...filter, highValueOnly: e.target.checked })}
              />
              <label htmlFor="highValueOnly" className="text-sm font-medium">
                High Value Transactions Only
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required2faOnly"
                checked={filter.required2faOnly}
                onChange={(e) => setFilter({ ...filter, required2faOnly: e.target.checked })}
              />
              <label htmlFor="required2faOnly" className="text-sm font-medium">
                2FA Required Transactions Only
              </label>
            </div>
          </div>
          
          <Button variant="outline" onClick={applyFilters} className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {audits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Audit Logs Found</h3>
                  <p className="text-sm text-muted-foreground">
                    No transaction audit logs match your current filters
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Security</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audits.map((audit) => (
                        <TableRow key={audit.id}>
                          <TableCell className="font-mono text-xs">
                            {formatDate(audit.created_at)}
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate" title={getUserEmail(audit.user_id)}>
                            {getUserEmail(audit.user_id)}
                          </TableCell>
                          <TableCell>
                            <span className={
                              audit.transaction_type === 'buy' 
                                ? 'text-green-600 font-medium' 
                                : 'text-red-600 font-medium'
                            }>
                              {audit.transaction_type.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell>{audit.asset_symbol}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${audit.value.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              audit.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : audit.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {audit.status === 'completed' && (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              )}
                              {audit.status === 'rejected' && (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              )}
                              {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              {audit.high_value && (
                                <span className="inline-flex items-center text-xs text-yellow-600">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  High Value
                                </span>
                              )}
                              {audit.required_2fa && (
                                <span className="inline-flex items-center text-xs text-blue-600">
                                  <Shield className="h-3 w-3 mr-1" />
                                  2FA Verified
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
