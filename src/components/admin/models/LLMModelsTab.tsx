
import { Bot } from "lucide-react";
import { DeepSeekChat } from "../../llm-extensions/deepseek/DeepSeekChat";
import { OpenAIChat } from "../../llm-extensions/openai/OpenAIChat";
import { GrokChat } from "../../llm-extensions/grok/GrokChat";
import { ClaudeChat } from "../../llm-extensions/claude/ClaudeChat";

export const LLMModelsTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="p-3 bg-slate-100 border-b flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-600" />
          <h3 className="font-medium">DeepSeek AI</h3>
        </div>
        <div className="p-4 h-[400px] overflow-y-auto">
          <DeepSeekChat />
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="p-3 bg-slate-100 border-b flex items-center">
          <Bot className="h-5 w-5 mr-2 text-green-600" />
          <h3 className="font-medium">OpenAI Chat</h3>
        </div>
        <div className="p-4 h-[400px] overflow-y-auto">
          <OpenAIChat />
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="p-3 bg-slate-100 border-b flex items-center">
          <Bot className="h-5 w-5 mr-2 text-purple-600" />
          <h3 className="font-medium">Grok AI</h3>
        </div>
        <div className="p-4 h-[400px] overflow-y-auto">
          <GrokChat />
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="p-3 bg-slate-100 border-b flex items-center">
          <Bot className="h-5 w-5 mr-2 text-orange-600" />
          <h3 className="font-medium">Claude AI</h3>
        </div>
        <div className="p-4 h-[400px] overflow-y-auto">
          <ClaudeChat />
        </div>
      </div>
    </div>
  );
};
