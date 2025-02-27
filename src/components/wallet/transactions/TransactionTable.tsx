
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee';
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  currency: string;
  timestamp: Date;
  details: string;
  hash?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  formatAmount: (amount: number, currency: string) => string;
  formatDate: (date: Date) => string;
}

export const TransactionTable = ({ 
  transactions, 
  formatAmount, 
  formatDate 
}: TransactionTableProps) => {

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Date & Time</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <div className="flex items-center">
                  {transaction.type === 'deposit' ? (
                    <ArrowDownRight className="h-4 w-4 mr-2 text-green-500" />
                  ) : transaction.type === 'withdrawal' ? (
                    <ArrowUpRight className="h-4 w-4 mr-2 text-red-500" />
                  ) : (
                    <span className="w-4 h-4 mr-2 inline-block"></span>
                  )}
                  <span className="capitalize">{transaction.type}</span>
                </div>
              </TableCell>
              
              <TableCell className={`font-medium ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.amount >= 0 ? '+' : ''}
                {formatAmount(transaction.amount, transaction.currency)} {transaction.currency}
              </TableCell>
              
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  {getStatusIcon(transaction.status)}
                  <span className="capitalize text-sm">{transaction.status}</span>
                </div>
              </TableCell>
              
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {formatDate(transaction.timestamp)}
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Badge variant="outline" className="text-xs">
                    {transaction.status}
                  </Badge>
                  
                  {transaction.hash && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={`https://etherscan.io/tx/${transaction.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-full hover:bg-secondary/50"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on blockchain</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
