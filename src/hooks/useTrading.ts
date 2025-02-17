
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Trade, TradingPair } from '@/types/trading'
import { useToast } from '@/hooks/use-toast'

export const useTrading = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: tradingPairs, isLoading: isLoadingPairs } = useQuery({
    queryKey: ['tradingPairs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trading_pairs')
        .select('*')
        .order('symbol')

      if (error) throw error
      return data as TradingPair[]
    },
  })

  const { data: trades, isLoading: isLoadingTrades } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*, trading_pairs(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as (Trade & { trading_pairs: TradingPair })[]
    },
  })

  const createTrade = useMutation({
    mutationFn: async (newTrade: Omit<Trade, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('trades')
        .insert([newTrade])
        .select('*, trading_pairs(*)')
        .single()

      if (error) throw error
      return data as Trade & { trading_pairs: TradingPair }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] })
      toast({
        title: 'Trade Created',
        description: 'Your trade has been submitted successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error Creating Trade',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  return {
    tradingPairs,
    trades,
    isLoading: isLoadingPairs || isLoadingTrades,
    createTrade: createTrade.mutate,
  }
}
