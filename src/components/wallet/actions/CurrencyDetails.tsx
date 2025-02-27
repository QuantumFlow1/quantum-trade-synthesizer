
export interface Currency {
  symbol: string;
  name: string;
  network: string;
  min: number;
  max: number;
}

interface CurrencyDetailsProps {
  currencyDetails: Currency | undefined;
  showMax?: boolean;
}

export const CurrencyDetails = ({ currencyDetails, showMax = false }: CurrencyDetailsProps) => {
  if (!currencyDetails) return null;
  
  return (
    <div className="text-sm space-y-1">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Network:</span>
        <span>{currencyDetails.network}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Min {showMax ? 'Withdrawal' : 'Deposit'}:</span>
        <span>{currencyDetails.min} {currencyDetails.symbol}</span>
      </div>
      {showMax && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Max Withdrawal:</span>
          <span>{currencyDetails.max} {currencyDetails.symbol}</span>
        </div>
      )}
    </div>
  );
};
