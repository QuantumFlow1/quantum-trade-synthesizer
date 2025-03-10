
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { CryptoMessage } from '../../types';

export function useToolCallsProcessor() {
  const processToolCalls = async (toolCalls: any[], setMessages: React.Dispatch<React.SetStateAction<CryptoMessage[]>>) => {
    if (!toolCalls || toolCalls.length === 0) return;
    
    for (const call of toolCalls) {
      try {
        if (call.function.name === 'getCryptoPrice') {
          const { symbol } = JSON.parse(call.function.arguments);
          
          // Call the crypto-price-data function
          const { data, error } = await supabase.functions.invoke('crypto-price-data', {
            body: { symbol }
          });
          
          if (error) {
            console.error('Error fetching crypto price data:', error);
            continue;
          }
          
          if (data.success && data.data) {
            // Format price data message
            const priceInfo = data.data;
            const priceMessage = `
### ${priceInfo.name} (${priceInfo.symbol}) Current Data
**Price:** $${priceInfo.price.toLocaleString()}
**24h Change:** ${priceInfo.price_change_percentage_24h > 0 ? '▲' : '▼'} ${Math.abs(priceInfo.price_change_percentage_24h).toFixed(2)}% ($${Math.abs(priceInfo.price_change_24h).toFixed(2)})
**Market Cap:** $${priceInfo.market_cap.toLocaleString()}
**24h Volume:** $${priceInfo.total_volume.toLocaleString()}
**Last Updated:** ${new Date(priceInfo.last_updated).toLocaleString()}

![${priceInfo.name} Logo](${priceInfo.image})
`;
            
            const dataMessage: CryptoMessage = {
              id: uuidv4(),
              role: 'system',
              content: priceMessage,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, dataMessage]);
          }
        }
        // Additional tool handling can be added here
      } catch (error) {
        console.error(`Error processing tool call ${call.function.name}:`, error);
      }
    }
  };
  
  return { processToolCalls };
}
