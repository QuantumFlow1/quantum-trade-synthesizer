import { groqAgent } from "./groqAgent";
import { otherAgent1 } from "./otherAgent1";
import { otherAgent2 } from "./otherAgent2";

// Export the combined list including the Groq agent
export const tradingAgents = [
  otherAgent1,
  otherAgent2,
  groqAgent
];
