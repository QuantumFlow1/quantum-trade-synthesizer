
const transactions = [
  {
    id: 1,
    type: "BUY",
    asset: "BTC",
    amount: "0.25",
    price: "$45,234.12",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "SELL",
    asset: "ETH",
    amount: "2.5",
    price: "$2,345.67",
    time: "5 min ago",
  },
  {
    id: 3,
    type: "BUY",
    asset: "BTC",
    amount: "0.1",
    price: "$45,123.45",
    time: "10 min ago",
  },
];

const TransactionList = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-4">Type</th>
              <th className="pb-4">Asset</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-secondary">
                <td className="py-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      tx.type === "BUY"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="py-4">{tx.asset}</td>
                <td className="py-4">{tx.amount}</td>
                <td className="py-4">{tx.price}</td>
                <td className="py-4 text-muted-foreground">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
