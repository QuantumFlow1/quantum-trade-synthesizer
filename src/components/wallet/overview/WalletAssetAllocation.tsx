
interface WalletAssetAllocationProps {
  // We could add more detailed asset data in the future
  assets?: {
    symbol: string;
    percentage: number;
  }[];
}

export const WalletAssetAllocation = ({ assets }: WalletAssetAllocationProps) => {
  // Default assets if none provided
  const defaultAssets = [
    { symbol: "BTC", percentage: 45 },
    { symbol: "ETH", percentage: 30 },
    { symbol: "USDT", percentage: 15 },
    { symbol: "Others", percentage: 10 },
  ];

  const displayAssets = assets || defaultAssets;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Asset Allocation</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {displayAssets.map((asset) => (
          <div key={asset.symbol} className="p-3 bg-secondary/20 rounded-md">
            <div className="text-sm font-medium">{asset.symbol}</div>
            <div className="text-lg font-bold">{asset.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};
