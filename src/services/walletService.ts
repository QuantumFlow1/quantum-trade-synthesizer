
import { supabase } from "@/lib/supabase";

interface CreateWalletParams {
  name: string;
  type: "spot" | "margin" | "futures";
}

interface CreateTransactionParams {
  walletId: string;
  type: "deposit" | "withdrawal";
  amount: number;
  description?: string;
}

export const walletService = {
  // Create a new wallet
  async createWallet(userId: string, params: CreateWalletParams) {
    const { data, error } = await supabase
      .from("wallets")
      .insert({
        user_id: userId,
        name: params.name,
        type: params.type
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's wallets
  async getUserWallets(userId: string) {
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create a wallet transaction
  async createTransaction(params: CreateTransactionParams) {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: params.walletId,
        type: params.type,
        amount: params.amount,
        description: params.description,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get wallet transactions
  async getWalletTransactions(walletId: string) {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id", walletId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update transaction status
  async updateTransactionStatus(transactionId: string, status: string) {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .update({ status })
      .eq("id", transactionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
