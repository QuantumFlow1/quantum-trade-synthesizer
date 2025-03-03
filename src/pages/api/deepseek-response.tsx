
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, apiKey } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const { data, error } = await supabase.functions.invoke('deepseek-response', {
      body: { messages, apiKey }
    });

    if (error) {
      console.error('DeepSeek API error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in deepseek-response API route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
