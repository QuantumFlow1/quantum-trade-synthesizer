
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, AlertTriangle, Shield } from "lucide-react";
import { type TransactionAudit } from "./types";

interface AuditLogTableProps {
  audits: TransactionAudit[];
  getUserEmail: (userId: string) => string;
  formatDate: (dateString: string) => string;
}

export const AuditLogTable = ({ 
  audits, 
  getUserEmail, 
  formatDate 
}: AuditLogTableProps) => {
  return (
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
  );
};
