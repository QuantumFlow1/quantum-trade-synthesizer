
import { useState } from 'react';
import { useAuth } from "@/components/auth/AuthProvider";
import { logTransactionAudit, TransactionType } from '@/utils/transactionAuditLogger';

export const useTransactionAudit = () => {
  const { user } = useAuth();
  const [isLogging, setIsLogging] = useState(false);
  
  const auditTransaction = async (
    transactionType: TransactionType,
    assetSymbol: string,
    amount: number,
    price: number,
    isHighValue = false,
    required2FA = false
  ) => {
    if (!user) return false;
    
    setIsLogging(true);
    try {
      const value = amount * price;
      const success = await logTransactionAudit({
        userId: user.id,
        transactionType,
        assetSymbol,
        amount,
        price,
        value,
        isHighValue,
        required2FA
      });
      
      return success;
    } catch (error) {
      console.error('Transaction audit failed:', error);
      return false;
    } finally {
      setIsLogging(false);
    }
  };
  
  return {
    auditTransaction,
    isLogging
  };
};
