
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export type TransactionType = 'buy' | 'sell' | 'transfer' | 'deposit' | 'withdrawal';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'rejected';

interface TransactionAuditData {
  userId: string;
  transactionType: TransactionType;
  assetSymbol: string;
  amount: number;
  price: number;
  value: number;
  isHighValue?: boolean;
  required2FA?: boolean;
}

/**
 * Log a transaction to the audit system
 * Uses edge function with fallback to direct database insert
 */
export const logTransactionAudit = async (
  data: TransactionAuditData,
  status: TransactionStatus = 'completed'
): Promise<boolean> => {
  try {
    console.log(`Logging transaction audit for ${data.transactionType} of ${data.assetSymbol}`);
    
    // Try to use the edge function
    const { error } = await supabase.functions.invoke('log-transaction-audit', {
      body: {
        userId: data.userId,
        orderType: data.transactionType,
        assetSymbol: data.assetSymbol,
        amount: data.amount,
        price: data.price,
        value: data.value,
        isHighValue: !!data.isHighValue,
        required2FA: !!data.required2FA,
        status
      }
    });
    
    if (error) {
      console.error('Error logging transaction audit via edge function:', error.message);
      
      // Fallback to direct database insert
      const { error: insertError } = await supabase
        .from('transaction_audits')
        .insert({
          user_id: data.userId,
          transaction_type: data.transactionType,
          asset_symbol: data.assetSymbol,
          amount: data.amount,
          price: data.price,
          value: data.value,
          high_value: !!data.isHighValue,
          required_2fa: !!data.required2FA,
          status,
          source_ip: 'client-direct',
          user_agent: navigator.userAgent
        });
      
      if (insertError) {
        console.error('Fallback transaction audit logging failed:', insertError.message);
        return false;
      }
      
      return true;
    }
    
    console.log('Transaction audit logged successfully');
    return true;
  } catch (e) {
    console.error('Failed to log transaction audit:', e);
    
    // Log failure to console with all details for debugging
    console.info('Transaction Audit Fallback:', {
      ...data,
      status,
      timestamp: new Date().toISOString()
    });
    
    return false;
  }
};

/**
 * Show a toast notification for transaction audit errors
 */
export const showTransactionAuditErrorToast = (message: string): void => {
  toast({
    title: "Transaction Audit Error",
    description: message,
    variant: "destructive",
  });
};
