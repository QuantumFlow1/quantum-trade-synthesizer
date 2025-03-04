
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the request data
    const { userId } = await req.json();

    console.log("Sending 2FA code for user:", userId);

    // In a real implementation, this would generate and send a code via SMS or email
    // For this demo, we'll just simulate the sending

    // Get the user's contact information
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email, phone')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      throw userError;
    }

    // Generate a code (in a real implementation, this would be random)
    const generatedCode = "123456";

    // Log the code sending attempt
    const { error: logError } = await supabase
      .from('security_audit_logs')
      .insert({
        user_id: userId,
        action: '2fa_code_sent',
        status: 'success',
        source_ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        details: JSON.stringify({ 
          method: userData.phone ? 'sms' : 'email',
          destination: userData.phone ? userData.phone : userData.email
        })
      });

    if (logError) {
      console.error("Error logging code sending:", logError);
    }

    console.log("2FA code sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error sending 2FA code:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
