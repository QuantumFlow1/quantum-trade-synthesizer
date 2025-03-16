
import { OllamaFullChat } from "@/components/llm-extensions/ollama/OllamaFullChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export default function OllamaChatPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Ollama Chat Interface</h1>
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="flex items-center">
              <Terminal className="mr-2 h-5 w-5 text-teal-600" />
              Local Ollama Models
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <OllamaFullChat />
          </CardContent>
        </Card>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Available models: llama3.1, llama3.2, llama3.3, qwq, deepseek-r1, gemma3, llama2</p>
          <p>Connected to: http://localhost:11434</p>
        </div>
      </div>
    </div>
  );
}
