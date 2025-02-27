
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { CurrencySelector } from "./CurrencySelector";
import { CurrencyDetails } from "./CurrencyDetails";
import { DepositAddress } from "./DepositAddress";
import { Currency } from "./CurrencySelector";

interface DepositTabProps {
  selectedCurrency: string;
  setSelectedCurrency: (value: string) => void;
  currencies: Currency[];
  walletAddress: string;
  copyToClipboard: (text: string) => void;
  showQRCode: boolean;
  setShowQRCode: (value: boolean) => void;
  handleDeposit: () => void;
}

export const DepositTab = ({
  selectedCurrency,
  setSelectedCurrency,
  currencies,
  walletAddress,
  copyToClipboard,
  showQRCode,
  setShowQRCode,
  handleDeposit
}: DepositTabProps) => {
  const selectedCurrencyDetails = currencies.find(c => c.symbol === selectedCurrency);
  
  return (
    <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
      <div className="space-y-4">
        <CurrencySelector
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          currencies={currencies}
          id="deposit-currency"
        />
        
        {selectedCurrencyDetails && (
          <CurrencyDetails currencyDetails={selectedCurrencyDetails} />
        )}
        
        <Alert variant="warning" className="bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Only send {selectedCurrency} to this address. Sending any other cryptocurrency may result in permanent loss.
          </AlertDescription>
        </Alert>
        
        <DepositAddress
          walletAddress={walletAddress}
          copyToClipboard={copyToClipboard}
          showQRCode={showQRCode}
          toggleQRCode={() => setShowQRCode(!showQRCode)}
        />
        
        <div className="flex justify-center">
          <Button onClick={handleDeposit}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Address
          </Button>
        </div>
      </div>
    </Card>
  );
};
