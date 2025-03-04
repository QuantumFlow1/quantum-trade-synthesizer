
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate a secure random 6-digit code
function generateSecureCode(): string {
  const digits = new Uint8Array(6);
  crypto.getRandomValues(digits);
  return Array.from(digits)
    .map(digit => digit % 10)
    .join("");
}

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
      case 'check_account_security':
        return await checkAccountSecurity(supabase, data, req);
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

  if (!userId) {
    throw new Error("User ID is required");
  }

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

  // Generate a secure random code
  const generatedCode = generateSecureCode();
  
  // Store the code in the database with an expiry time
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 10); // Code expires in 10 minutes
  
  const { error: storeError } = await supabase
    .from('security_codes')
    .upsert({
      user_id: userId,
      code: generatedCode,
      expires_at: expiryTime.toISOString(),
      type: '2fa',
      consumed: false
    });
    
  if (storeError) {
    console.error("Error storing security code:", storeError);
    throw storeError;
  }

  // In a real implementation, we would send the code via SMS or email
  console.log(`Code ${generatedCode} would be sent to ${userData.phone || userData.email}`);

  // Log the code sending attempt
  const sourceIp = req.headers.get('cf-connecting-ip') || 
                  req.headers.get('x-forwarded-for') || 
                  'unknown';
                  
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  const { error: logError } = await supabase
    .from('security_audit_logs')
    .insert({
      user_id: userId,
      action: '2fa_code_sent',
      status: 'success',
      source_ip: sourceIp,
      user_agent: userAgent,
      details: JSON.stringify({ 
        method: userData.phone ? 'sms' : 'email',
        destination: userData.phone ? userData.phone : userData.email,
        code_expiry: expiryTime.toISOString()
      })
    });

  if (logError) {
    console.error("Error logging code sending:", logError);
  }

  console.log("2FA code sent successfully");

  return new Response(
    JSON.stringify({ 
      success: true,
      expiresAt: expiryTime.toISOString() 
    }),
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
  console.log("Verifying 2FA code:", { userId, codeLength: code?.length });
  
  if (!userId || !code) {
    throw new Error("User ID and code are required");
  }

  // Check the code against the database
  const now = new Date().toISOString();
  
  const { data: codeData, error: codeError } = await supabase
    .from('security_codes')
    .select('*')
    .eq('user_id', userId)
    .eq('code', code)
    .eq('type', '2fa')
    .eq('consumed', false)
    .gte('expires_at', now)
    .single();
    
  if (codeError) {
    console.error("Error verifying code:", codeError);
  }
  
  const isVerified = !!codeData;

  // If verified, mark the code as consumed
  if (isVerified) {
    const { error: updateError } = await supabase
      .from('security_codes')
      .update({ consumed: true })
      .eq('id', codeData.id);
      
    if (updateError) {
      console.error("Error marking code as consumed:", updateError);
    }
  }

  // Log the verification attempt
  const sourceIp = req.headers.get('cf-connecting-ip') || 
                  req.headers.get('x-forwarded-for') || 
                  'unknown';
                  
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  const { error } = await supabase
    .from('security_audit_logs')
    .insert({
      user_id: userId,
      action: '2fa_verification',
      status: isVerified ? 'success' : 'failed',
      source_ip: sourceIp,
      user_agent: userAgent,
      details: JSON.stringify({ 
        verification_type: '2fa',
        attempt_time: now
      })
    });

  if (error) {
    console.error("Error logging verification attempt:", error);
  }

  if (isVerified) {
    console.log("2FA verification successful");
    
    // Update the user's last verified timestamp
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        last_2fa_verified: now,
        security_status: 'verified'
      })
      .eq('id', userId);
      
    if (profileError) {
      console.error("Error updating profile verification status:", profileError);
    }
  } else {
    console.log("2FA verification failed");
    
    // If this is the 5th failed attempt in a row, lock the account
    const { data: failedAttempts, error: countError } = await supabase
      .from('security_audit_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('action', '2fa_verification')
      .eq('status', 'failed')
      .gte('created_at', new Date(Date.now() - 30 * 60000).toISOString()) // Last 30 minutes
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (!countError && failedAttempts && failedAttempts.length >= 5) {
      console.warn(`User ${userId} has 5 or more failed 2FA attempts. Applying security lock.`);
      
      const { error: securityError } = await supabase
        .from('profiles')
        .update({ 
          security_status: 'locked',
          security_locked_reason: 'too_many_failed_2fa'
        })
        .eq('id', userId);
        
      if (securityError) {
        console.error("Error updating security status:", securityError);
      }
    }
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

// Check account security status
async function checkAccountSecurity(supabase, { userId }, req) {
  console.log("Checking account security for user:", userId);
  
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  // Get the user's profile and security information
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    console.error("Error fetching user profile:", profileError);
    throw profileError;
  }
  
  // Get recent login attempts
  const { data: recentLogins, error: loginError } = await supabase
    .from('security_audit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('action', 'login')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (loginError) {
    console.error("Error fetching recent logins:", loginError);
  }
  
  // Determine security recommendations
  const recommendations = [];
  
  if (!profile.phone) {
    recommendations.push({
      type: 'add_phone',
      severity: 'high',
      message: 'Add a phone number to enable SMS 2FA'
    });
  }
  
  if (profile.security_status === 'locked') {
    recommendations.push({
      type: 'account_locked',
      severity: 'critical',
      message: 'Your account is locked due to suspicious activity'
    });
  }
  
  // Log the security check
  const sourceIp = req.headers.get('cf-connecting-ip') || 
                  req.headers.get('x-forwarded-for') || 
                  'unknown';
                  
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  const { error: logError } = await supabase
    .from('security_audit_logs')
    .insert({
      user_id: userId,
      action: 'security_check',
      status: 'success',
      source_ip: sourceIp,
      user_agent: userAgent,
      details: JSON.stringify({ 
        recommendations_count: recommendations.length
      })
    });

  if (logError) {
    console.error("Error logging security check:", logError);
  }

  return new Response(
    JSON.stringify({
      securityStatus: profile.security_status || 'unverified',
      lastVerified: profile.last_2fa_verified || null,
      hasTwoFactor: !!profile.phone,
      recentLogins: recentLogins || [],
      recommendations
    }),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      } 
    }
  );
}
