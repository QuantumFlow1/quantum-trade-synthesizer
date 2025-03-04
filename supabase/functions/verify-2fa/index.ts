
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

    // Parse the verification data from the request
    const { code, userId } = await req.json();

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
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    return new Response(
      JSON.stringify({ error: error.message, verified: false }),
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
