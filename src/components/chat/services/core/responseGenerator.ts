
// This file handles the generation of responses from various LLM APIs

import { claudeService } from "../claudeService";
import { deepseekService } from "../deepseekService";
import { fallbackService } from "../fallbackService";
import { geminiService } from "../geminiService";
import { grok3Service } from "../grok3Service";
import { openaiService } from "../openaiService";

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
  modelName: string,
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

    // Select the appropriate service based on the model name
    if (modelName.startsWith("grok")) {
      const response = await grok3Service.generateResponse(
        messages,
        modelName,
        apiKey,
        temperature,
        maxTokens
      );
      return response;
    } else if (modelName.startsWith("claude")) {
      const response = await claudeService.generateResponse(
        messages,
        modelName,
        apiKey,
        temperature,
        maxTokens
      );
      return response;
    } else if (modelName.startsWith("gemini")) {
      const response = await geminiService.generateResponse(
        messages,
        modelName,
        apiKey,
        temperature,
        maxTokens
      );
      return response;
    } else if (modelName.startsWith("deepseek")) {
      const response = await deepseekService.generateResponse(
        messages,
        modelName,
        apiKey,
        temperature,
        maxTokens
      );
      return response;
    } else if (modelName.startsWith("gpt")) {
      const response = await openaiService.generateResponse(
        messages,
        modelName,
        apiKey,
        temperature,
        maxTokens
      );
      return response;
    } else {
      // Use fallback service for unknown models
      const response = await fallbackService.generateResponse(
        messages,
        modelName,
        apiKey,
        temperature,
        maxTokens
      );
      return response;
    }
  } catch (error) {
    console.error("Error generating response:", error);
    return `Error generating response: ${error instanceof Error ? error.message : String(error)}`;
  }
}
