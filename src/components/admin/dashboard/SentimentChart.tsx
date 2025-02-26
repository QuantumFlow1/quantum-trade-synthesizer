
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatTime, formatDate } from "./dateFormatUtils";

const SentimentChart = () => {
  const [formattedSentimentData, setFormattedSentimentData] = useState<any[]>([]);

  // Create mock data to use if real data is not available
  const mockSentimentData = Array.from({ length: 24 }, (_, i) => ({
    id: `mock-sentiment-${i}`,
    collected_at: new Date(Date.now() - (i * 3600000)).toISOString(),
    data_type: 'social_sentiment',
    content: {
      sentiment: Math.random() * 2 - 1,
      confidence: Math.random() * 0.5 + 0.5
    }
  }));

  const { data: sentimentData, isLoading: sentimentLoading, error: sentimentError } = useQuery({
    queryKey: ['sentimentData'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('agent_collected_data')
          .select('*')
          .eq('data_type', 'social_sentiment')
          .order('collected_at', { ascending: false })
          .limit(24);
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching sentiment data:', err);
        return [];
      }
    }
  });

  // Process the data once it's loaded
  useEffect(() => {
    // Process sentiment data
    if (sentimentData && sentimentData.length > 0) {
      const processed = sentimentData.map(item => {
        try {
          // Handle both string and object content formats
          const contentData = typeof item.content === 'string' 
            ? JSON.parse(item.content) 
            : item.content;

          return {
            ...item,
            collected_at: item.collected_at,
            content: {
              sentiment: contentData.sentiment || 0,
              confidence: contentData.confidence || 0
            }
          };
        } catch (err) {
          console.error('Error processing sentiment data item:', err, item);
          return {
            ...item,
            content: { sentiment: 0, confidence: 0 }
          };
        }
      });
      
      setFormattedSentimentData(processed);
    } else {
      setFormattedSentimentData(mockSentimentData);
    }
  }, [sentimentData]);

  // Log data for debugging
  useEffect(() => {
    console.log('Sentiment Data to display:', formattedSentimentData);
  }, [formattedSentimentData]);

  // Display mock data if real data is not available or empty
  const displaySentimentData = formattedSentimentData.length > 0 ? formattedSentimentData : mockSentimentData;

  if (sentimentError) {
    console.error('Sentiment data error:', sentimentError);
  }

  return (
    <Card className="bg-background/80 border border-border/50">
      <CardHeader>
        <CardTitle>Social Sentiment Analysis</CardTitle>
        <CardDescription>Sentiment trend van sociale media</CardDescription>
      </CardHeader>
      <CardContent>
        {sentimentLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading sentiment data...</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displaySentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="collected_at"
                  tickFormatter={formatTime}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={formatDate}
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white"
                  }}
                />
                <Bar 
                  dataKey="content.sentiment" 
                  fill="#8884d8" 
                  name="Sentiment Score"
                  isAnimationActive={false}
                />
                <Bar 
                  dataKey="content.confidence" 
                  fill="#82ca9d" 
                  name="Confidence"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
