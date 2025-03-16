
import React from "react";
import { GrokChat } from "@/components/chat/GrokChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function OllamaChatPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Chat Interface</h1>
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5 text-blue-600" />
              Multi-Model AI Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[70vh]">
            <GrokChat />
          </CardContent>
        </Card>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Available models: Grok, OpenAI, Claude, and more</p>
          <p>Configure API keys in settings to use different models</p>
        </div>
      </div>
    </div>
  );
}
