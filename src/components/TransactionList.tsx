
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

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
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setTransactions(data);
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
          setTransactions((current) => [payload.new as Transaction, ...current].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      tradesSubscription.unsubscribe();
    };
  }, [user]);

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
