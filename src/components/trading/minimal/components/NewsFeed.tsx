
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface NewsFeedProps {
  selectedPair: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
}

export const NewsFeed = ({ selectedPair }: NewsFeedProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch news based on the selected pair
    const fetchNews = () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const asset = selectedPair.split('/')[0];
        
        // Generate mock news items
        const mockNews: NewsItem[] = [
          {
            id: "1",
            title: `${asset} Surges as Institutional Interest Grows`,
            source: "CryptoNews",
            date: "10 minutes ago",
            url: "#",
            sentiment: "positive"
          },
          {
            id: "2",
            title: `Regulatory Concerns Cause ${asset} Volatility`,
            source: "Financial Times",
            date: "2 hours ago",
            url: "#",
            sentiment: "negative"
          },
          {
            id: "3",
            title: `Technical Analysis: ${asset} Shows Strong Support Levels`,
            source: "TradingView Blog",
            date: "4 hours ago",
            url: "#",
            sentiment: "positive"
          },
          {
            id: "4",
            title: `Major Exchange Announces New ${asset} Trading Pairs`,
            source: "CoinDesk",
            date: "Yesterday",
            url: "#",
            sentiment: "positive"
          },
          {
            id: "5",
            title: `${asset} Foundation Releases Q2 Development Update`,
            source: "BlockchainNews",
            date: "2 days ago",
            url: "#",
            sentiment: "neutral"
          }
        ];
        
        setNews(mockNews);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchNews();
  }, [selectedPair]);

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Latest {selectedPair.split('/')[0]} News
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <div 
                key={item.id}
                className="p-3 rounded-md border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    item.sentiment === 'positive' 
                      ? 'bg-green-500/10 text-green-500' 
                      : item.sentiment === 'negative'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{item.source}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center text-sm"
                  >
                    Read More
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
