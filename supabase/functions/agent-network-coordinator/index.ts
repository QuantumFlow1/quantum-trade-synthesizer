
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

let messages: AgentMessage[] = [];
let tasks: AgentTask[] = [];

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
            taskCount: tasks.length
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
        return new Response(
          JSON.stringify({ 
            status: "success", 
            messages: messages
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "get_tasks":
        return new Response(
          JSON.stringify({ 
            status: "success", 
            tasks: tasks
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case "coordinate_analysis":
        console.log("Coordinating collaborative analysis");
        
        // Simulate multi-agent analysis coordination
        const analysisResult = await generateMultiAgentAnalysis(data.prompt, data.modelId);
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            analysis: analysisResult
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
async function generateMultiAgentAnalysis(prompt: string, primaryModelId: string): Promise<string> {
  try {
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
    
    // Simulate messages between agents
    const agentIds = ["market-analyzer", "risk-manager", "trading-executor", primaryModelId];
    
    // Create some simulated inter-agent messages
    for (let i = 0; i < agentIds.length; i++) {
      if (agentIds[i] !== primaryModelId) {
        // Message from coordinator to agent
        messages.push({
          id: crypto.randomUUID(),
          sender: primaryModelId,
          receiver: agentIds[i],
          content: `Requesting analysis input for: ${prompt.substring(0, 50)}...`,
          timestamp: new Date().toISOString()
        });
        
        // Response from agent to coordinator
        messages.push({
          id: crypto.randomUUID(),
          sender: agentIds[i],
          receiver: primaryModelId,
          content: `Providing ${agentIds[i]} specific analysis for the query`,
          timestamp: new Date(Date.now() + 1000).toISOString()
        });
      }
    }
    
    // For now, just use the generate-trading-advice function
    // In a more advanced implementation, we would collect and combine inputs from multiple agents
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
    const result = data.response;
    
    // Update task status
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = "completed";
      tasks[taskIndex].completedAt = new Date().toISOString();
      tasks[taskIndex].result = result.substring(0, 100) + "...";
    }
    
    return result;
  } catch (error) {
    console.error("Error generating multi-agent analysis:", error);
    throw error;
  }
}
