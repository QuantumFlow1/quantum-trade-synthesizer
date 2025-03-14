import { useState } from 'react';
import { useTransactionAudit } from './useTransactionAudit';
import { TransactionType } from '@/utils/transactionAuditLogger';
import { evaluateTransactionRules, AuditRuleSet } from '@/utils/auditRuleEngine';

export const useTransactionAuditWithRules = (customRules?: AuditRuleSet) => {
  const { auditTransaction, isLogging } = useTransactionAudit();
  const [lastTriggeredRules, setLastTriggeredRules] = useState<string[]>([]);
  
  /**
   * Audits a transaction with automatic rule evaluation
   * @param transactionType - Type of transaction
   * @param assetSymbol - Symbol of the asset
   * @param amount - Transaction amount
   * @param price - Asset price
   * @param overrideRules - Optional flag to bypass automatic rule evaluation
   * @param manualHighValue - Manual high value flag (only used when overrideRules is true)
   * @param manualRequired2FA - Manual 2FA required flag (only used when overrideRules is true)
   */
  const auditTransactionWithRules = async (
    transactionType: TransactionType,
    assetSymbol: string,
    amount: number,
    price: number,
    overrideRules?: boolean,
    manualHighValue?: boolean,
    manualRequired2FA?: boolean
  ) => {
    // If override is true, use manual values
    if (overrideRules) {
      return auditTransaction(
        transactionType,
        assetSymbol,
        amount,
        price,
        !!manualHighValue,
        !!manualRequired2FA
      );
    }
    
    // Otherwise evaluate rules
    const { isHighValue, required2FA, triggeredRules } = evaluateTransactionRules(
      transactionType,
      amount,
      price,
      customRules
    );
    
    setLastTriggeredRules(triggeredRules);
    
    return auditTransaction(
      transactionType,
      assetSymbol,
      amount,
      price,
      isHighValue,
      required2FA
    );
  };
  
  return {
    auditTransactionWithRules,
    lastTriggeredRules,
    isLogging
  };
};
