
import { TransactionType } from './transactionAuditLogger';

export type AuditRule = {
  name: string;
  condition: (amount: number, price: number) => boolean;
  consequences: {
    isHighValue?: boolean;
    required2FA?: boolean;
  };
};

export type AuditRuleSet = {
  [key in TransactionType]?: AuditRule[];
};

/**
 * Default rules for different transaction types
 */
export const defaultRules: AuditRuleSet = {
  buy: [
    {
      name: 'High Value Purchase',
      condition: (amount, price) => amount * price > 10000,
      consequences: {
        isHighValue: true,
        required2FA: true,
      },
    },
    {
      name: 'Medium Value Purchase',
      condition: (amount, price) => amount * price > 5000 && amount * price <= 10000,
      consequences: {
        isHighValue: true,
        required2FA: false,
      },
    },
  ],
  sell: [
    {
      name: 'High Value Sale',
      condition: (amount, price) => amount * price > 10000,
      consequences: {
        isHighValue: true,
        required2FA: true,
      },
    },
  ],
  withdrawal: [
    {
      name: 'Large Withdrawal',
      condition: (amount) => amount > 5000,
      consequences: {
        isHighValue: true,
        required2FA: true,
      },
    },
    {
      name: 'Medium Withdrawal',
      condition: (amount) => amount > 1000 && amount <= 5000,
      consequences: {
        isHighValue: false,
        required2FA: true,
      },
    },
  ],
  deposit: [
    {
      name: 'Large Deposit',
      condition: (amount) => amount > 10000,
      consequences: {
        isHighValue: true,
      },
    },
  ],
  transfer: [
    {
      name: 'Large Transfer',
      condition: (amount) => amount > 10000,
      consequences: {
        isHighValue: true,
        required2FA: true,
      },
    },
  ],
};

/**
 * Evaluates transaction data against rules and returns audit flags
 * @param transactionType - Type of transaction
 * @param amount - Transaction amount
 * @param price - Asset price (if applicable)
 * @param customRules - Optional custom rules to override defaults
 * @returns Object with flags for high value and 2FA requirements
 */
export const evaluateTransactionRules = (
  transactionType: TransactionType,
  amount: number,
  price: number = 1,
  customRules?: AuditRuleSet
): { 
  isHighValue: boolean; 
  required2FA: boolean;
  triggeredRules: string[];
} => {
  const rules = customRules || defaultRules;
  const applicableRules = rules[transactionType] || [];
  
  let isHighValue = false;
  let required2FA = false;
  const triggeredRules: string[] = [];
  
  for (const rule of applicableRules) {
    if (rule.condition(amount, price)) {
      triggeredRules.push(rule.name);
      
      if (rule.consequences.isHighValue) {
        isHighValue = true;
      }
      
      if (rule.consequences.required2FA) {
        required2FA = true;
      }
    }
  }
  
  return {
    isHighValue,
    required2FA,
    triggeredRules
  };
};
