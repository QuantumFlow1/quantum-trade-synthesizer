
// This file handles the generation of responses from various LLM APIs

import { generateClaudeResponse } from "../claudeService";
import { generateDeepSeekResponse } from "../deepseekService";
import { generateFallbackResponse } from "../fallbackService";
import { generateGeminiResponse } from "../geminiService";
import { generateGrok3Response } from "../grok3Service";
import { generateOpenAIResponse } from "../openaiService";
import { ModelId } from "../../types/GrokSettings";

/**
 * Generates a response using the appropriate service based on the model name
 * @param messages Array of chat messages
 * @param modelName Name of the model to use
 * @param apiKey API key for the model
 * @param temperature Temperature parameter for the model
 * @param maxTokens Maximum tokens for the response
 * @returns Response from the model
 */
export async function generateResponse(
  messages: Array<{ role: string; content: string }>,
  modelName: ModelId, // Updated type to ModelId
  apiKey: string,
  temperature: number = 0.7,
  maxTokens: number = 1000
): Promise<string> {
  try {
    console.log(`Generating response using ${modelName}`);
    
    // Validate input parameters
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid or empty messages array");
    }
    
    if (!modelName) {
      throw new Error("Model name is required");
    }
    
    if (!apiKey) {
      throw new Error("API key is required");
    }

    // Get the last message content for services that need it
    const inputMessage = messages[messages.length - 1].content;
    // Create conversation history without the last message
    const conversationHistory = messages.slice(0, -1);

    // Select the appropriate service based on the model name
    if (modelName.startsWith("grok")) {
      const response = await generateGrok3Response(
        inputMessage,
        conversationHistory,
        { 
          selectedModel: modelName, 
          apiKeys: { 
            // Fixed ApiKeySettings structure
            openaiApiKey: "", 
            claudeApiKey: "", 
            geminiApiKey: "", 
            deepseekApiKey: ""
          }, 
          temperature, 
          maxTokens,
          deepSearchEnabled: false,
          thinkEnabled: false
        }
      );
      return response;
    } else if (modelName.startsWith("claude")) {
      const response = await generateClaudeResponse(
        inputMessage,
        conversationHistory,
        { 
          selectedModel: modelName, 
          apiKeys: { 
            openaiApiKey: "", 
            claudeApiKey: apiKey, 
            geminiApiKey: "", 
            deepseekApiKey: "" 
          }, 
          temperature, 
          maxTokens,
          deepSearchEnabled: false,
          thinkEnabled: false
        }
      );
      return response;
    } else if (modelName.startsWith("gemini")) {
      const response = await generateGeminiResponse(
        inputMessage,
        conversationHistory,
        { 
          selectedModel: modelName, 
          apiKeys: { 
            openaiApiKey: "", 
            claudeApiKey: "", 
            geminiApiKey: apiKey, 
            deepseekApiKey: "" 
          }, 
          temperature, 
          maxTokens,
          deepSearchEnabled: false,
          thinkEnabled: false
        }
      );
      return response;
    } else if (modelName.startsWith("deepseek")) {
      const response = await generateDeepSeekResponse(
        inputMessage,
        conversationHistory,
        { 
          selectedModel: modelName, 
          apiKeys: { 
            openaiApiKey: "", 
            claudeApiKey: "", 
            geminiApiKey: "", 
            deepseekApiKey: apiKey 
          }, 
          temperature, 
          maxTokens,
          deepSearchEnabled: false,
          thinkEnabled: false
        }
      );
      return response;
    } else if (modelName.startsWith("gpt")) {
      const response = await generateOpenAIResponse(
        inputMessage,
        conversationHistory,
        { 
          selectedModel: modelName, 
          apiKeys: { 
            openaiApiKey: apiKey, 
            claudeApiKey: "", 
            geminiApiKey: "", 
            deepseekApiKey: "" 
          }, 
          temperature, 
          maxTokens,
          deepSearchEnabled: false,
          thinkEnabled: false
        }
      );
      return response;
    } else {
      // Use fallback service for unknown models
      const response = await generateFallbackResponse(
        inputMessage,
        conversationHistory
      );
      return response;
    }
  } catch (error) {
    console.error("Error generating response:", error);
    return `Error generating response: ${error instanceof Error ? error.message : String(error)}`;
  }
}
