
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface AgentMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
}

interface AgentTask {
  id: string;
  assignedTo: string;
  description: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  result?: string;
}

interface AgentRecommendation {
  id: string;
  agentId: string;
  action: "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";
  confidence: number;
  reasoning: string;
  ticker?: string;
  price?: number;
  timestamp: string;
}

interface PortfolioDecision {
  id: string;
  action: "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";
  ticker: string;
  amount: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
  confidence: number;
  riskScore: number;
  contributors: string[];
  reasoning: string;
  timestamp: string;
}

// Store messages, tasks, recommendations and decisions in memory (would use a database in production)
let messages: AgentMessage[] = [];
let tasks: AgentTask[] = [];
let recommendations: AgentRecommendation[] = [];
let portfolioDecisions: PortfolioDecision[] = [];

// Store active collaboration sessions
let collaborationSessions: Record<string, {
  id: string,
  status: 'active' | 'completed',
  participants: string[],
  createdAt: string,
  completedAt?: string,
  summary?: string
}> = {};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    console.log(`Agent network coordinator received action: ${action}`);
    
    switch (action) {
      case "status":
        return new Response(
          JSON.stringify({ 
            status: "active", 
            message: "Agent network coordinator is operational",
            agentCount: 10,
            messageCount: messages.length,
            taskCount: tasks.length,
            recommendationCount: recommendations.length,
            decisionCount: portfolioDecisions.length,
            sessionCount: Object.keys(collaborationSessions).length
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "send_message":
        if (!data.sender || !data.receiver || !data.content) {
          throw new Error("Missing required message fields");
        }
        
        const newMessage: AgentMessage = {
          id: crypto.randomUUID(),
          sender: data.sender,
          receiver: data.receiver,
          content: data.content,
          timestamp: new Date().toISOString()
        };
        
        messages.push(newMessage);
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            message: "Message sent successfully",
            messageId: newMessage.id
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "create_task":
        if (!data.assignedTo || !data.description) {
          throw new Error("Missing required task fields");
        }
        
        const newTask: AgentTask = {
          id: crypto.randomUUID(),
          assignedTo: data.assignedTo,
          description: data.description,
          status: "pending",
          createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            message: "Task created successfully",
            taskId: newTask.id
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "update_task":
        if (!data.taskId || !data.status) {
          throw new Error("Missing required task update fields");
        }
        
        const taskIndex = tasks.findIndex(t => t.id === data.taskId);
        
        if (taskIndex === -1) {
          throw new Error("Task not found");
        }
        
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          status: data.status,
          ...(data.status === "completed" && { 
            completedAt: new Date().toISOString(),
            result: data.result || "Task completed"
          })
        };
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            message: "Task updated successfully"
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      
      case "submit_recommendation":
        if (!data.agentId || !data.action || data.confidence === undefined || !data.reasoning) {
          throw new Error("Missing required recommendation fields");
        }
        
        const newRecommendation: AgentRecommendation = {
          id: crypto.randomUUID(),
          agentId: data.agentId,
          action: data.action,
          confidence: data.confidence,
          reasoning: data.reasoning,
          ticker: data.ticker,
          price: data.price,
          timestamp: new Date().toISOString()
        };
        
        recommendations.push(newRecommendation);
        
        // Create a message from this agent to the portfolio manager
        const recommendationMessage: AgentMessage = {
          id: crypto.randomUUID(),
          sender: data.agentId,
          receiver: "portfolio-manager",
          content: `New ${data.action} recommendation for ${data.ticker || 'the market'} with ${data.confidence}% confidence: ${data.reasoning}`,
          timestamp: new Date().toISOString()
        };
        
        messages.push(recommendationMessage);
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            message: "Recommendation submitted successfully",
            recommendationId: newRecommendation.id
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      
      case "create_portfolio_decision":
        if (!data.action || !data.ticker || data.amount === undefined || data.price === undefined) {
          throw new Error("Missing required portfolio decision fields");
        }
        
        const newDecision: PortfolioDecision = {
          id: crypto.randomUUID(),
          action: data.action,
          ticker: data.ticker,
          amount: data.amount,
          price: data.price,
          stopLoss: data.stopLoss,
          takeProfit: data.takeProfit,
          confidence: data.confidence || 75,
          riskScore: data.riskScore || 5,
          contributors: data.contributors || ["portfolio-manager"],
          reasoning: data.reasoning || `Portfolio decision to ${data.action} ${data.ticker}`,
          timestamp: new Date().toISOString()
        };
        
        portfolioDecisions.push(newDecision);
        
        // Create a message from portfolio manager to trading executor
        const decisionMessage: AgentMessage = {
          id: crypto.randomUUID(),
          sender: "portfolio-manager",
          receiver: "trading-executor",
          content: `Execute ${data.action} for ${data.amount} ${data.ticker} at $${data.price}. Stop loss: ${data.stopLoss}, Take profit: ${data.takeProfit}`,
          timestamp: new Date().toISOString()
        };
        
        messages.push(decisionMessage);
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            message: "Portfolio decision created successfully",
            decisionId: newDecision.id
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      
      case "get_recommendations":
        const filteredRecommendations = data?.filter ? 
          recommendations.filter(r => 
            (data.filter.agentId ? r.agentId === data.filter.agentId : true) && 
            (data.filter.action ? r.action === data.filter.action : true)
          ) : 
          recommendations;
          
        return new Response(
          JSON.stringify({ 
            status: "success", 
            recommendations: filteredRecommendations
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      
      case "get_portfolio_decisions":
        const filteredDecisions = data?.filter ? 
          portfolioDecisions.filter(d => 
            (data.filter.ticker ? d.ticker === data.filter.ticker : true) && 
            (data.filter.action ? d.action === data.filter.action : true)
          ) : 
          portfolioDecisions;
          
        return new Response(
          JSON.stringify({ 
            status: "success", 
            decisions: filteredDecisions
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "get_messages":
        const filteredMessages = data?.filter ? 
          messages.filter(m => 
            (data.filter.sender ? m.sender === data.filter.sender : true) && 
            (data.filter.receiver ? m.receiver === data.filter.receiver : true)
          ) : 
          messages;
          
        return new Response(
          JSON.stringify({ 
            status: "success", 
            messages: filteredMessages
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "get_tasks":
        const filteredTasks = data?.filter ? 
          tasks.filter(t => data.filter.assignedTo ? t.assignedTo === data.filter.assignedTo : true) : 
          tasks;
          
        return new Response(
          JSON.stringify({ 
            status: "success", 
            tasks: filteredTasks
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "create_collaboration_session":
        if (!data.participants || !Array.isArray(data.participants)) {
          throw new Error("Missing required session fields");
        }
        
        const sessionId = crypto.randomUUID();
        collaborationSessions[sessionId] = {
          id: sessionId,
          status: 'active',
          participants: data.participants,
          createdAt: new Date().toISOString()
        };
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            message: "Collaboration session created successfully",
            sessionId: sessionId
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "complete_collaboration_session":
        if (!data.sessionId || !data.summary) {
          throw new Error("Missing required session completion fields");
        }
        
        if (!collaborationSessions[data.sessionId]) {
          throw new Error("Collaboration session not found");
        }
        
        collaborationSessions[data.sessionId] = {
          ...collaborationSessions[data.sessionId],
          status: 'completed',
          completedAt: new Date().toISOString(),
          summary: data.summary
        };
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            message: "Collaboration session completed successfully"
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "get_collaboration_sessions":
        return new Response(
          JSON.stringify({ 
            status: "success", 
            sessions: Object.values(collaborationSessions)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "coordinate_analysis":
        console.log("Coordinating collaborative analysis");
        
        // Create a collaboration session
        const analysisSessionId = crypto.randomUUID();
        const modelIds = data.modelIds || ["grok3", "market-analyzer", "risk-manager", "portfolio-manager", "value-investor", "technical-expert", "fundamentals-expert", "valuation-expert"];
        
        collaborationSessions[analysisSessionId] = {
          id: analysisSessionId,
          status: 'active',
          participants: modelIds,
          createdAt: new Date().toISOString()
        };
        
        // Create tasks for each participating model
        for (const modelId of modelIds) {
          tasks.push({
            id: crypto.randomUUID(),
            assignedTo: modelId,
            description: `Analyze ${data.prompt.substring(0, 50)}...`,
            status: "pending",
            createdAt: new Date().toISOString()
          });
          
          // Create messages between coordinator and agents
          if (modelId !== data.primaryModelId) {
            messages.push({
              id: crypto.randomUUID(),
              sender: data.primaryModelId || "coordinator",
              receiver: modelId,
              content: `Please analyze: ${data.prompt.substring(0, 50)}...`,
              timestamp: new Date().toISOString()
            });
          }
        }
        
        // Simulate multi-agent analysis coordination
        const analysisResult = await generateMultiAgentAnalysis(data.prompt, data.primaryModelId, modelIds);
        
        // Complete the session
        collaborationSessions[analysisSessionId] = {
          ...collaborationSessions[analysisSessionId],
          status: 'completed',
          completedAt: new Date().toISOString(),
          summary: analysisResult.substring(0, 200) + "..."
        };
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            analysis: analysisResult,
            sessionId: analysisSessionId
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("Error in agent-network-coordinator:", error);
    
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: error.message || "Unknown error occurred" 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Enhanced function to simulate multi-agent collaborative analysis with specialized agents
async function generateMultiAgentAnalysis(
  prompt: string, 
  primaryModelId: string,
  participants: string[]
): Promise<string> {
  try {
    console.log(`Generating multi-agent analysis with ${participants.length} participants`);
    
    // Create a fake task for tracking
    const taskId = crypto.randomUUID();
    const task: AgentTask = {
      id: taskId,
      assignedTo: primaryModelId,
      description: "Generate collaborative trading analysis",
      status: "in-progress",
      createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    
    // Generate contributions from specialized agent types with more sophisticated responses
    const modelContributions: Record<string, string> = {};
    
    // Simulate specific contributions from different agent types
    for (const participant of participants) {
      let contribution = "";
      
      if (participant === "market-analyzer") {
        contribution = "Market analysis indicates a bullish divergence on the 4-hour chart with increasing volume. Key resistance levels at $45,200 and $46,800.";
      } else if (participant === "risk-manager") {
        contribution = "Risk assessment: Medium risk profile with recommended stop-loss at $41,300. Current market volatility suggests a 2% position size maximum.";
      } else if (participant === "trading-executor") {
        contribution = "Executing orders with scaled entries at $42,800, $43,200, and $43,600 with proportional stop losses and trailing take profit targets.";
      } else if (participant === "portfolio-manager") {
        contribution = "Portfolio allocation suggests increasing cryptocurrency exposure by 3%. Current market conditions favor a 60/40 long/short ratio.";
      } else if (participant === "value-investor") {
        contribution = "Bill Ackman analysis: Current valuation metrics show assets trading at a 12% discount to intrinsic value. Accumulation strategy recommended.";
      } else if (participant === "fundamentals-expert") {
        contribution = "Warren Buffett analysis: Underlying fundamentals remain strong despite market fluctuations. Cash flow projections support continued growth.";
      } else if (participant === "technical-expert") {
        contribution = "Technical patterns indicate a potential cup and handle formation with a breakout target of $48,500. MACD shows positive momentum building.";
      } else if (participant === "valuation-expert") {
        contribution = "Valuation models (DCF, comparable analysis) suggest fair value of $46,200 with a potential upside of 8.5% from current levels.";
      } else if (participant === "sentiment-analyzer") {
        contribution = "Social sentiment analysis shows positive shift in market sentiment with 68% bullish signals across major platforms and decreasing FUD.";
      } else {
        // Generic contribution for other models
        contribution = `${participant} model suggests considering a balanced approach with proper risk management.`;
      }
      
      modelContributions[participant] = contribution;
      
      // Add messages to simulate communication
      messages.push({
        id: crypto.randomUUID(),
        sender: participant,
        receiver: primaryModelId || "coordinator",
        content: contribution,
        timestamp: new Date(Date.now() + 1000).toISOString()
      });
    }
    
    // For now, combine model contributions with the trading advice function
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-trading-advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({
        message: prompt,
        userLevel: 'intermediate'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error calling generate-trading-advice: ${response.statusText}`);
    }
    
    const data = await response.json();
    let result = data.response;
    
    // Generate trading recommendations based on agent insights
    const tradingRecommendations = [
      "**Long BTC with entry at $42,800:** Set stop-loss at $41,300 and take-profit targets at $45,200 and $46,800.",
      "**Add to existing positions:** Current market conditions suggest scaling into positions with 25% of total allocation per entry point.",
      "**Hold cash reserves of 30%:** Maintain liquidity for potential pullbacks and new entry opportunities.",
      "**Consider short positions on altcoins:** Hedge against overall market volatility while maintaining Bitcoin long exposure."
    ];
    
    // Add Enhanced Multi-Agent Analysis section
    result += "\n\n## Enhanced Multi-Agent Analysis\n\n";
    result += "Our AI Hedge Fund architecture has analyzed current market conditions through multiple specialized agents:\n\n";
    
    // Add specialized sections by agent type
    result += "### Market Sentiment & Technical Analysis\n";
    if (modelContributions["sentiment-analyzer"]) {
      result += `- ${modelContributions["sentiment-analyzer"]}\n`;
    }
    if (modelContributions["technical-expert"]) {
      result += `- ${modelContributions["technical-expert"]}\n`;
    }
    if (modelContributions["market-analyzer"]) {
      result += `- ${modelContributions["market-analyzer"]}\n`;
    }
    
    result += "\n### Fundamental & Valuation Analysis\n";
    if (modelContributions["fundamentals-expert"]) {
      result += `- ${modelContributions["fundamentals-expert"]}\n`;
    }
    if (modelContributions["valuation-expert"]) {
      result += `- ${modelContributions["valuation-expert"]}\n`;
    }
    if (modelContributions["value-investor"]) {
      result += `- ${modelContributions["value-investor"]}\n`;
    }
    
    result += "\n### Risk & Portfolio Management\n";
    if (modelContributions["risk-manager"]) {
      result += `- ${modelContributions["risk-manager"]}\n`;
    }
    if (modelContributions["portfolio-manager"]) {
      result += `- ${modelContributions["portfolio-manager"]}\n`;
    }
    if (modelContributions["trading-executor"]) {
      result += `- ${modelContributions["trading-executor"]}\n`;
    }
    
    // Add coordinated trading recommendations
    result += "\n## Coordinated Trading Recommendations\n\n";
    tradingRecommendations.forEach(rec => {
      result += `- ${rec}\n`;
    });
    
    // Add guide for simulation mode
    result += "\n## Trading Simulation Guide\n\n";
    result += "For optimal results, we recommend testing these strategies in simulation mode first:\n\n";
    result += "1. **Start with low position sizes** to understand the volatility profile\n";
    result += "2. **Monitor stop-loss levels** carefully to ensure risk management is effective\n";
    result += "3. **Compare performance** of different entry/exit strategies before real execution\n";
    result += "4. **Practice scaling in and out** of positions to optimize your profit-taking strategy\n";
    
    // Update task status
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = "completed";
      tasks[taskIndex].completedAt = new Date().toISOString();
      tasks[taskIndex].result = "Collaborative analysis completed successfully";
    }
    
    // Generate a sample recommendation
    const sampleRecommendation: AgentRecommendation = {
      id: crypto.randomUUID(),
      agentId: "portfolio-manager",
      action: "BUY",
      confidence: 75,
      reasoning: "Multi-agent analysis indicates favorable entry point with positive risk/reward ratio",
      ticker: "BTC",
      price: 42800,
      timestamp: new Date().toISOString()
    };
    
    recommendations.push(sampleRecommendation);
    
    return result;
  } catch (error) {
    console.error("Error generating multi-agent analysis:", error);
    throw error;
  }
}
