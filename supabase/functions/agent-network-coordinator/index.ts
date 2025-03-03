
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

// Store messages and tasks in memory (would use a database in production)
let messages: AgentMessage[] = [];
let tasks: AgentTask[] = [];

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
            agentCount: 6,
            messageCount: messages.length,
            taskCount: tasks.length,
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
        const modelIds = data.modelIds || ["grok3", "market-analyzer", "risk-manager"];
        
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

// Function to simulate multi-agent collaborative analysis
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
    
    // Generate a unique signature for each model to demonstrate their input
    const modelContributions: Record<string, string> = {};
    
    // Simulate specific contributions from different agent types
    for (const participant of participants) {
      let contribution = "";
      
      if (participant === "market-analyzer") {
        contribution = "Market analysis suggests trending patterns with significant volume indicating strong market interest.";
      } else if (participant === "risk-manager") {
        contribution = "Risk assessment: Medium risk profile with recommended stop-loss at key support levels.";
      } else if (participant === "trading-executor") {
        contribution = "Suggested entry points identified at previous resistance levels with scaled position sizing.";
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
    
    // Add model contributions as "insights from collaborating agents" section
    result += "\n\n## Insights from Collaborating Agents\n\n";
    for (const [modelId, contribution] of Object.entries(modelContributions)) {
      result += `- **${modelId}**: ${contribution}\n`;
    }
    
    // Update task status
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = "completed";
      tasks[taskIndex].completedAt = new Date().toISOString();
      tasks[taskIndex].result = "Collaborative analysis completed successfully";
    }
    
    return result;
  } catch (error) {
    console.error("Error generating multi-agent analysis:", error);
    throw error;
  }
}
