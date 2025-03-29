
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NLPMarketQueryInput } from './NLPMarketQueryInput';
import { AISignalBox } from './AISignalBox';
import { useAIMarketAnalysis } from '@/hooks/use-ai-market-analysis';
import { Bot, Sparkles, HelpCircle, BrainCircuit, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AIMarketAnalysisPage() {
  const {
    isAnalysisLoading,
    isSignalsLoading,
    analysisResult,
    signals,
    error,
    generateMarketAnalysis,
    refreshSignals
  } = useAIMarketAnalysis();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <BrainCircuit className="mr-2 h-6 w-6 text-primary" />
            AI Marktanalyse
          </h1>
          <p className="text-muted-foreground mt-1">
            Krijg geavanceerde marktanalyse en handelssignalen met AI-ondersteuning
          </p>
        </div>
        <Badge variant="outline" className="text-sm flex items-center">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          AI-Powered
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <NLPMarketQueryInput 
            onQuerySubmit={generateMarketAnalysis}
            isLoading={isAnalysisLoading}
          />
          
          {analysisResult && (
            <Card className="border shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-primary" />
                  Marktanalyse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-xs">
                    Betrouwbaarheid: {analysisResult.confidence}%
                  </Badge>
                </div>
                <div className="text-sm">
                  {analysisResult.answer}
                </div>
                
                {analysisResult.relatedQuestions && analysisResult.relatedQuestions.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <HelpCircle className="mr-1 h-4 w-4 text-muted-foreground" />
                      Gerelateerde vragen:
                    </h3>
                    <div className="space-y-1">
                      {analysisResult.relatedQuestions.map((question, index) => (
                        <Button 
                          key={index} 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-xs text-primary"
                          onClick={() => generateMarketAnalysis(question)}
                        >
                          <ChevronRight className="h-3 w-3 mr-1" />
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <AISignalBox 
          signals={signals}
          isLoading={isSignalsLoading}
          onRefresh={refreshSignals}
        />
      </div>
    </div>
  );
}
