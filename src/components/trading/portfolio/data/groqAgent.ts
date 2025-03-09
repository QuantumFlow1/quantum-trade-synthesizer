
import { GroqAgent } from "../types/groqAgentTypes";

// Default Groq agent definition
export const groqAgent: GroqAgent = {
  id: "groq-analyst",
  name: "Groq LLM Analyst",
  specialization: "fundamental",
  description: "Advanced market analysis powered by Groq's LLM API",
  weight: 0.85, // High weight due to comprehensive analysis
  confidence: 0.85,
  successRate: 0.8,
  type: "groq",
  config: {
    model: "llama3-70b-8192",
    temperature: 0.7,
    maxTokens: 2048,
    enabled: true,
    systemPrompt: `You are an expert financial analyst with deep knowledge of market trends, technical analysis, and fundamental factors.
    Analyze the provided market data and generate a trading recommendation (BUY, SELL, or HOLD) based on a holistic assessment.
    Provide your confidence level (0-100), clear reasoning, and key market signals that influenced your decision.`
  }
};
