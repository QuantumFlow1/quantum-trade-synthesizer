
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useSupabase() {
  const { toast } = useToast();

  const executeQuery = useCallback(async <T>(
    queryFn: () => Promise<{ data: T | null; error: Error | null }>,
    errorMessage = 'Database error'
  ) => {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        console.error(errorMessage, error);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Unexpected error executing query:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  return {
    supabase,
    executeQuery
  };
}
