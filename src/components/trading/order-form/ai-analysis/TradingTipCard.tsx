
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TradingTipProps {
  tip: {
    id: string;
    title: string;
    text: string;
  };
}

const TradingTipCard: React.FC<TradingTipProps> = ({ tip }) => {
  return (
    <Card 
      id={tip.id} 
      className="mb-8 mx-auto max-w-2xl shadow-md bg-card/80 backdrop-blur-sm"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-center">{tip.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{tip.text}</p>
      </CardContent>
    </Card>
  );
};

export default TradingTipCard;
