
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
    const { userId, formData } = await req.json();

    console.log("Processing KYC submission for user:", userId);

    // In a real implementation, this would securely send the data to a KYC provider
    // and store references to documents, not the documents themselves
    
    // Check if user already has a KYC record
    const { data: existingKyc, error: kycError } = await supabase
      .from('user_kyc')
      .select('id, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (kycError) {
      console.error("Error checking existing KYC:", kycError);
      throw kycError;
    }

    let kycResult;
    if (existingKyc) {
      // Update existing KYC record
      const { data, error } = await supabase
        .from('user_kyc')
        .update({
          document_type: formData.documentType,
          status: 'pending',
          updated_at: new Date().toISOString(),
          submission_data: {
            full_name: formData.fullName,
            date_of_birth: formData.dateOfBirth,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postal_code: formData.postalCode,
            document_number: formData.documentNumber
          }
        })
        .eq('id', existingKyc.id)
        .select();

      if (error) {
        console.error("Error updating KYC record:", error);
        throw error;
      }
      
      kycResult = data;
    } else {
      // Create new KYC record
      const { data, error } = await supabase
        .from('user_kyc')
        .insert({
          user_id: userId,
          document_type: formData.documentType,
          status: 'pending',
          submission_data: {
            full_name: formData.fullName,
            date_of_birth: formData.dateOfBirth,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postal_code: formData.postalCode,
            document_number: formData.documentNumber
          }
        })
        .select();

      if (error) {
        console.error("Error creating KYC record:", error);
        throw error;
      }
      
      kycResult = data;
    }

    // Log the KYC submission
    const { error: logError } = await supabase
      .from('security_audit_logs')
      .insert({
        user_id: userId,
        action: 'kyc_submission',
        status: 'pending',
        source_ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        details: JSON.stringify({ 
          document_type: formData.documentType,
          kyc_id: kycResult[0].id
        })
      });

    if (logError) {
      console.error("Error logging KYC submission:", logError);
    }

    console.log("KYC submission processed successfully");

    return new Response(
      JSON.stringify({ success: true, kyc: kycResult[0] }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error processing KYC submission:', error);
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
