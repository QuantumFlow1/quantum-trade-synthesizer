
import { Filter, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { type User } from "./types";
import { type AuditLogFilter } from "@/hooks/useAuditLogs";

interface AuditLogFiltersProps {
  filter: AuditLogFilter;
  setFilter: (filter: AuditLogFilter) => void;
  users: User[];
  applyFilters: () => void;
  resetFilters: () => void;
  exportToCSV: () => void;
}

export const AuditLogFilters = ({
  filter,
  setFilter,
  users,
  applyFilters,
  resetFilters,
  exportToCSV
}: AuditLogFiltersProps) => {
  return (
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
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
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
              <SelectItem value="pending">Pending</SelectItem>
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
    </div>
  );
};
