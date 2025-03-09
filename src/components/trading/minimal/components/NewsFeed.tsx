
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export interface NewsFeedProps {
  selectedPair: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: Date;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedTo: string[];
}

export const NewsFeed = ({ selectedPair }: NewsFeedProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // For now, we'll simulate a delay and generate mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock news based on the selected pair
      const baseCurrency = selectedPair ? selectedPair.split('/')[0] : 'BTC';
      
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: `${baseCurrency} Price Surges Following Positive Regulatory News`,
          source: 'CryptoNews',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          url: '#',
          sentiment: 'positive',
          relatedTo: [baseCurrency, 'Regulation']
        },
        {
          id: '2',
          title: `Major Exchange Adds New ${baseCurrency} Trading Pairs`,
          source: 'BlockchainReport',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          url: '#',
          sentiment: 'positive',
          relatedTo: [baseCurrency, 'Exchange']
        },
        {
          id: '3',
          title: `Analysts Predict ${baseCurrency} Volatility in Coming Weeks`,
          source: 'CryptoAnalyst',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          url: '#',
          sentiment: 'neutral',
          relatedTo: [baseCurrency, 'Analysis']
        },
        {
          id: '4',
          title: 'Market-Wide Correction Affects All Major Cryptocurrencies',
          source: 'CoinDesk',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          url: '#',
          sentiment: 'negative',
          relatedTo: ['Market', baseCurrency, 'ETH']
        },
        {
          id: '5',
          title: `New Development Partnership Announced for ${baseCurrency} Network`,
          source: 'DailyBlock',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          url: '#',
          sentiment: 'positive',
          relatedTo: [baseCurrency, 'Development']
        }
      ];
      
      setNews(mockNews);
      setIsLoading(false);
    };
    
    fetchNews();
  }, [selectedPair]);
  
  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatTimeDifference = (timestamp: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Market News
        </CardTitle>
        <Badge variant="outline">
          {selectedPair || 'All Markets'}
        </Badge>
      </CardHeader>
      <CardContent className="px-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-3 px-2 border-b last:border-0">
              <div className="flex items-start justify-between">
                <div className="w-4/5">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          news.map(item => (
            <div key={item.id} className="py-3 px-2 border-b last:border-0 hover:bg-muted/20 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-sm hover:underline flex items-center gap-1"
                  >
                    {item.title}
                    <ExternalLink className="h-3 w-3 inline ml-1" />
                  </a>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{formatTimeDifference(item.timestamp)}</span>
                  </div>
                </div>
                <Badge className={getSentimentColor(item.sentiment)}>
                  {item.sentiment}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
