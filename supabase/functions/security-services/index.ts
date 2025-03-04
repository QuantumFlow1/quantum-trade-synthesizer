
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

    const { action, ...data } = await req.json();
    console.log(`Processing security service action: ${action}`, data);

    // Route based on the requested action
    switch (action) {
      case 'send_2fa_code':
        return await sendTwoFactorCode(supabase, data, req);
      case 'verify_2fa_code':
        return await verifyTwoFactorCode(supabase, data, req);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in security service:', error);
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

// Send 2FA code function
async function sendTwoFactorCode(supabase, { userId }, req) {
  console.log("Sending 2FA code for user:", userId);

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
}

// Verify 2FA code function
async function verifyTwoFactorCode(supabase, { code, userId }, req) {
  console.log("Verifying 2FA code:", { code, userId });

  // In a real implementation, this would verify the code against a service like Twilio Verify
  // or check a time-based one-time password (TOTP)
  // For this demo, we'll simulate a successful verification if the code is "123456"
  const isVerified = code === "123456";

  // Log the verification attempt
  const { error } = await supabase
    .from('security_audit_logs')
    .insert({
      user_id: userId,
      action: '2fa_verification',
      status: isVerified ? 'success' : 'failed',
      source_ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
      details: JSON.stringify({ verification_type: '2fa' })
    });

  if (error) {
    console.error("Error logging verification attempt:", error);
  }

  if (isVerified) {
    console.log("2FA verification successful");
  } else {
    console.log("2FA verification failed");
  }

  return new Response(
    JSON.stringify({ verified: isVerified }),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      } 
    }
  );
}
