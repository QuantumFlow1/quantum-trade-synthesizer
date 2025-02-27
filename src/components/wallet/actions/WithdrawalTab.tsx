
import { Card } from "@/components/ui/card";
import { CurrencySelector } from "./CurrencySelector";
import { CurrencyDetails } from "./CurrencyDetails";
import { SecuritySelector } from "./SecuritySelector";
import { WithdrawalForm } from "./WithdrawalForm";
import { Currency } from "./CurrencySelector";

interface WithdrawalTabProps {
  selectedCurrency: string;
  setSelectedCurrency: (value: string) => void;
  currencies: Currency[];
  amount: string;
  setAmount: (value: string) => void;
  sendAddress: string;
  setSendAddress: (value: string) => void;
  securityLevel: string;
  setSecurityLevel: (value: string) => void;
  isProcessing: boolean;
  handleWithdraw: () => void;
  isValidAmount: (value: string) => boolean;
  isValidAddress: (value: string) => boolean;
  generateSecurityCode: () => string;
}

export const WithdrawalTab = ({
  selectedCurrency,
  setSelectedCurrency,
  currencies,
  amount,
  setAmount,
  sendAddress,
  setSendAddress,
  securityLevel,
  setSecurityLevel,
  isProcessing,
  handleWithdraw,
  isValidAmount,
  isValidAddress,
  generateSecurityCode
}: WithdrawalTabProps) => {
  const selectedCurrencyDetails = currencies.find(c => c.symbol === selectedCurrency);
  
  return (
    <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
      <div className="space-y-4">
        <CurrencySelector
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          currencies={currencies}
          id="withdraw-currency"
        />
        
        {selectedCurrencyDetails && (
          <CurrencyDetails currencyDetails={selectedCurrencyDetails} showMax={true} />
        )}
        
        <WithdrawalForm
          amount={amount}
          setAmount={setAmount}
          sendAddress={sendAddress}
          setSendAddress={setSendAddress}
          selectedCurrency={selectedCurrency}
          isProcessing={isProcessing}
          handleWithdraw={handleWithdraw}
          isValidAmount={isValidAmount}
          isValidAddress={isValidAddress}
        />
        
        <SecuritySelector
          securityLevel={securityLevel}
          setSecurityLevel={setSecurityLevel}
          generateSecurityCode={generateSecurityCode}
        />
      </div>
    </Card>
  );
};
