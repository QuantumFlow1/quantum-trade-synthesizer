
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { logApiCall } from "@/utils/apiLogger";
import { useTransactionAudit } from "@/hooks/useTransactionAudit";

interface Transaction {
  id: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  status: string;
  created_at: string;
}

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { auditTransaction } = useTransactionAudit();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        await logApiCall('trades/fetch', 'TransactionList', 'pending');
        
        const { data, error } = await supabase
          .from("trades")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        setTransactions(data || []);
        await logApiCall('trades/fetch', 'TransactionList', 'success');
        
        // Audit all transactions that might not have been audited
        if (data && data.length > 0) {
          data.forEach(tx => {
            if (tx.status === 'completed') {
              // Only audit completed transactions
              auditTransaction(
                tx.type,
                'Unknown',  // Asset symbol might be different in your schema
                tx.amount,
                tx.price,
                tx.amount * tx.price > 10000,  // High value threshold
                false  // Assuming 2FA info isn't available here
              );
            }
          });
        }
      } catch (error: any) {
        console.error("Error fetching transactions:", error);
        await logApiCall('trades/fetch', 'TransactionList', 'error', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();

    // Subscribe to new trades
    const tradesSubscription = supabase
      .channel("trades_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trades",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newTrade = payload.new as Transaction;
          setTransactions((current) => [newTrade, ...current].slice(0, 5));
          
          // Audit the new transaction
          if (newTrade.status === 'completed') {
            auditTransaction(
              newTrade.type,
              'Unknown',  // Asset symbol might be different in your schema
              newTrade.amount,
              newTrade.price,
              newTrade.amount * newTrade.price > 10000,
              false
            );
          }
        }
      )
      .subscribe();

    return () => {
      tradesSubscription.unsubscribe();
    };
  }, [user, auditTransaction]);

  if (isLoading) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="text-center py-8 text-muted-foreground">
          No transactions found. Start trading to see your history here.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-4">Type</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-secondary">
                <td className="py-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      tx.type === "buy"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tx.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-4">{tx.amount}</td>
                <td className="py-4">${tx.price.toFixed(2)}</td>
                <td className="py-4">
                  <span className="capitalize">{tx.status}</span>
                </td>
                <td className="py-4 text-muted-foreground">
                  {new Date(tx.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
