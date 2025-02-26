
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Settings2, Trash2, Send } from 'lucide-react';
import { AI_MODELS } from './types/GrokSettings';
import { useGrokChat } from './useGrokChat';
import { useToast } from '@/components/ui/use-toast';

const AdvancedLLMInterface: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    clearChat,
    grokSettings,
    setGrokSettings
  } = useGrokChat();

  // Task and parameters
  const [task, setTask] = useState<string>('market-analysis');
  const [maxTokens, setMaxTokens] = useState<number>(150);
  const [history, setHistory] = useState<Array<{ task: string; output: string }>>([]);
  
  // Update temperature from grokSettings when component mounts
  useEffect(() => {
    if (grokSettings.temperature) {
      setTemperature(grokSettings.temperature);
    }
  }, [grokSettings.temperature]);
  
  // Create local temperature state with setter that also updates grokSettings
  const [temperature, setTemperatureLocal] = useState<number>(grokSettings.temperature || 0.7);
  const setTemperature = (value: number) => {
    setTemperatureLocal(value);
    setGrokSettings({
      ...grokSettings,
      temperature: value
    });
  };
  
  // Selected model
  const selectedModel = AI_MODELS.find(m => m.id === grokSettings.selectedModel);
  const selectedModelName = selectedModel?.name || 'AI';

  const handleExit = () => {
    navigate('/');
    toast({
      title: "Interface verlaten",
      description: "Je hebt de AI interface verlaten.",
      duration: 3000,
    });
  };
  
  const handleModelChange = (modelId: string) => {
    setGrokSettings({
      ...grokSettings,
      selectedModel: modelId as any
    });
  };
  
  const handleGenerate = async () => {
    if (!inputMessage.trim()) {
      toast({
        title: "Geen input",
        description: "Voer eerst een prompt in voordat je genereert.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Combine task with input for context
    const contextualPrompt = `Taak: ${task}\n\n${inputMessage}`;
    await sendMessage(contextualPrompt);
    
    // Store in history
    if (messages.length > 0) {
      const lastResponse = messages[messages.length - 1].content;
      setHistory(prev => [...prev, { task, output: lastResponse }]);
    }
  };
  
  return (
    <Card className="w-full max-w-7xl mx-auto shadow-lg bg-white">
      {/* Header */}
      <div className="border-b py-4 px-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleExit}
            title="Verlaat interface"
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Geavanceerde {selectedModelName} Interface</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={clearChat}
            title="Wis chat geschiedenis"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Left side: Task selection and LLM choice */}
          <div className="w-full md:w-1/4 p-4 border-r">
            <h2 className="text-lg font-bold mb-4">Taakselectie</h2>
            <Select
              value={task}
              onValueChange={setTask}
            >
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Selecteer een taak" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market-analysis">Marktanalyse</SelectItem>
                <SelectItem value="educational-content">Educatieve Content</SelectItem>
                <SelectItem value="trading-advice">Trading Advies</SelectItem>
              </SelectContent>
            </Select>

            <h2 className="text-lg font-bold mb-4">LLM Model</h2>
            <Select
              value={grokSettings.selectedModel}
              onValueChange={handleModelChange}
            >
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Selecteer een model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map(model => (
                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <h2 className="text-lg font-bold mb-4">Parameters</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperatuur</Label>
                  <span className="text-sm">{temperature.toFixed(1)}</span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                </div>
                <Input
                  id="max-tokens"
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  min={10}
                  max={2000}
                />
              </div>
              
              <Button
                onClick={handleGenerate}
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? 'Bezig met genereren...' : 'Genereren'}
              </Button>
            </div>
          </div>

          {/* Middle: Content generation window */}
          <div className="flex-1 p-4 flex flex-col">
            <h2 className="text-lg font-bold mb-4">Content Generatie</h2>
            <Textarea
              className="w-full flex-grow mb-4"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Voer uw prompt in..."
            />
            <div className="p-4 border rounded-md bg-gray-50 min-h-[200px] max-h-[400px] overflow-y-auto">
              {messages.length > 0 ? (
                <div>
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-blue-600' : 'text-gray-800'}`}>
                      <strong>{message.role === 'user' ? 'Jij: ' : `${selectedModelName}: `}</strong>
                      <span>{message.content}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Resultaten worden hier weergegeven...</p>
              )}
            </div>
          </div>

          {/* Right side: History */}
          <div className="w-full md:w-1/4 p-4 border-l">
            <h2 className="text-lg font-bold mb-4">Geschiedenis</h2>
            {history.length > 0 ? (
              <ul className="space-y-4">
                {history.map((item, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded-md">
                    <div className="font-medium text-blue-600 mb-1">{item.task}</div>
                    <div className="text-sm text-gray-700">
                      {item.output.length > 100 
                        ? `${item.output.slice(0, 100)}...` 
                        : item.output}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Nog geen geschiedenis beschikbaar</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedLLMInterface;
