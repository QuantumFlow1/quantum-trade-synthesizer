
import { MarketData } from '@/components/market/types';
import { supabase } from '@/lib/supabase';
import { generateEmergencyMarketData } from '../utils/emergencyDataGenerator';
import { toast } from '@/hooks/use-toast';

export type FetchMarketDataResult = {
  data: MarketData[];
  error: string | null;
  source: 'primary' | 'fallback' | 'emergency';
};

/**
 * Fetches market data from primary and fallback sources
 * Returns either valid market data or error information
 */
export const fetchMarketData = async (): Promise<FetchMarketDataResult> => {
  try {
    console.log('Fetching market data...');
    
    // First try fetch-market-data function which has more detailed data
    const { data: fetchData, error: fetchError } = await supabase.functions.invoke('fetch-market-data');
    
    if (fetchError) {
      console.error('Error from fetch-market-data:', fetchError);
      throw new Error(`Failed to fetch market data: ${fetchError.message}`);
    }
    
    // Validate the data structure and ensure it includes crypto markets
    const isValidData = fetchData && 
                       Array.isArray(fetchData) && 
                       fetchData.length > 0 &&
                       fetchData.some(item => item.market === 'Crypto' || item.market === 'crypto');
    
    if (isValidData) {
      console.log('Successfully fetched data from fetch-market-data:', fetchData.length, 'items');
      
      toast({
        title: 'Market data updated',
        description: `Successfully fetched data for ${fetchData.length} markets`,
        duration: 3000,
      });
      
      return {
        data: fetchData as MarketData[],
        error: null,
        source: 'primary'
      };
    }
    
    // If that fails, try the market-data-collector as fallback
    console.log('No valid data from fetch-market-data, trying market-data-collector...');
    const { data: collectorData, error: collectorError } = await supabase.functions.invoke('market-data-collector');
    
    if (collectorError) {
      console.error('Error from market-data-collector:', collectorError);
      throw new Error(`Fallback data fetch failed: ${collectorError.message}`);
    }
    
    // Validate the collector data structure
    const isValidCollectorData = collectorData && 
                                Array.isArray(collectorData?.data) && 
                                collectorData.data.length > 0 &&
                                collectorData.data.some(item => item.symbol && item.price);
    
    if (isValidCollectorData) {
      console.log('Successfully fetched data from market-data-collector:', collectorData.data.length, 'items');
      
      toast({
        title: 'Market data updated',
        description: `Successfully fetched fallback data for ${collectorData.data.length} markets`,
        duration: 3000,
      });
      
      return {
        data: collectorData.data as MarketData[],
        error: null,
        source: 'fallback'
      };
    } 
    
    // Create some emergency backup market data if nothing else works
    const emergencyData = generateEmergencyMarketData();
    console.warn('Using emergency generated market data');
    
    toast({
      title: 'Using backup market data',
      description: 'Using locally generated data as fallback',
      variant: 'warning',
      duration: 5000,
    });
    
    return {
      data: emergencyData,
      error: 'Invalid market data format from both endpoints. Using emergency data.',
      source: 'emergency'
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    
    // Generate emergency data for error case
    const emergencyData = generateEmergencyMarketData();
    
    toast({
      title: 'Market data fallback',
      description: 'Using locally generated market data due to connection issues',
      variant: 'warning',
      duration: 5000,
    });
    
    return {
      data: emergencyData,
      error: error instanceof Error ? error.message : 'Unknown error fetching market data',
      source: 'emergency'
    };
  }
};
