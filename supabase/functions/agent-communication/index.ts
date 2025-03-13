
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Mock data voor agent-communication
const mockAgents = [
  {
    id: "agent-reception-001",
    name: "Receptioniste AI",
    type: "receptionist",
    status: "active",
    description: "Verwelkomt bezoekers en beantwoordt algemene vragen",
    performance: { successRate: 98, tasksCompleted: 150 },
    tasks: { completed: 150, pending: 2 }
  },
  {
    id: "agent-advisor-001",
    name: "Financieel Adviseur",
    type: "advisor",
    status: "active",
    description: "Analyseert marktgegevens en geeft financieel advies",
    performance: { successRate: 92, tasksCompleted: 78 },
    tasks: { completed: 78, pending: 3 }
  },
  {
    id: "agent-trader-001",
    name: "Handelsbot Alpha",
    type: "trader",
    status: "active",
    description: "Voert handelstransacties uit op basis van marktanalyse",
    performance: { successRate: 85, tasksCompleted: 120 },
    tasks: { completed: 120, pending: 5 }
  },
  {
    id: "agent-analyst-001",
    name: "Data Analist",
    type: "analyst",
    status: "paused",
    description: "Verzamelt en analyseert grote hoeveelheden marktgegevens",
    performance: { successRate: 95, tasksCompleted: 200 },
    tasks: { completed: 200, pending: 0 }
  }
];

const mockMessages = Array.from({ length: 12 }, (_, i) => ({
  id: `msg-${i}`,
  fromAgent: mockAgents[Math.floor(Math.random() * mockAgents.length)]?.id || "unknown",
  toAgent: mockAgents[Math.floor(Math.random() * mockAgents.length)]?.id || "unknown",
  content: `Dit is een testbericht ${i + 1} tussen agenten.`,
  timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
}));

const statuses = ['pending', 'in-progress', 'completed', 'failed'];
const priorities = ['low', 'medium', 'high'];

const mockTasks = Array.from({ length: 15 }, (_, i) => {
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return {
    id: `task-${i}`,
    agentId: mockAgents[Math.floor(Math.random() * mockAgents.length)]?.id || "unknown",
    description: `Taak ${i + 1}: Analyseer marktgegevens en rapporteer trends`,
    status,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    result: status === 'completed' ? "Taak succesvol afgerond met positieve resultaten" : undefined
  };
});

serve(async (req) => {
  // CORS headers voor lokale ontwikkeling
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  
  // Preflight OPTIONS verzoek afhandelen
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }
  
  try {
    // Het verzoek parseren
    const { action, data } = await req.json();
    
    switch (action) {
      case 'getAgents':
        return new Response(JSON.stringify({ 
          success: true, 
          data: mockAgents 
        }), { headers });
        
      case 'getMessages':
        return new Response(JSON.stringify({ 
          success: true, 
          data: mockMessages 
        }), { headers });
        
      case 'getTasks':
        return new Response(JSON.stringify({ 
          success: true, 
          data: mockTasks 
        }), { headers });
        
      case 'updateAgentStatus':
        if (!data || !data.agentId || !data.status) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: "Missing agentId or status in request" 
          }), { headers, status: 400 });
        }
        
        // In een echt scenario zou je hier de status in de database updaten
        return new Response(JSON.stringify({ 
          success: true, 
          message: `Agent ${data.agentId} status updated to ${data.status}`,
          agent: {
            ...mockAgents.find(a => a.id === data.agentId),
            status: data.status
          }
        }), { headers });
        
      default:
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Unknown action: ${action}` 
        }), { headers, status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Internal server error",
      details: error.message
    }), { headers, status: 500 });
  }
});
