
import { useEffect } from "react";
import { useToast } from "./use-toast";
import { supabase } from "@/lib/supabase";

export const useOAuthRedirect = () => {
  const { toast } = useToast();

  useEffect(() => {
    let isSubscribed = true;

    const handleHashFragment = async () => {
      if (!isSubscribed) return;

      // Check if we have a hash fragment or search params in the URL
      const hasHash = window.location.hash;
      const searchParams = window.location.search;
      
      console.log("Auth redirect detected", { hasHash, searchParams });

      if (hasHash || searchParams) {
        try {
          // If there's an error in the URL params, extract and show it
          if (searchParams.includes('error')) {
            const params = new URLSearchParams(searchParams);
            const errorDescription = params.get('error_description');
            
            console.error('Auth redirect error:', errorDescription);
            
            if (isSubscribed) {
              toast({
                title: "Authentication Error",
                description: errorDescription?.replace(/\+/g, ' ') || "There was an error during login. Please try again.",
                variant: "destructive",
              });
            }
          } 
          // If there's a hash, try to process it as an access token response
          else if (hasHash) {
            // Let Supabase handle the hash fragment
            const { data, error } = await supabase.auth.getSession();
            
            console.log("Session check:", { data, error });
            
            if (error && isSubscribed) {
              console.error('Session error:', error);
              toast({
                title: "Authentication Error",
                description: error.message || "Could not retrieve your session. Please try again.",
                variant: "destructive",
              });
            }
          }
        } catch (error: any) {
          console.error('Error handling auth redirect:', error);
          if (isSubscribed) {
            toast({
              title: "Authentication Error",
              description: error.message || "There was an error during login. Please try again.",
              variant: "destructive",
            });
          }
        }
        
        // Clean up the URL regardless of success or failure
        if (isSubscribed) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    // Process any auth redirects
    handleHashFragment().catch(error => {
      if (isSubscribed) {
        console.error('Error handling hash fragment:', error);
        toast({
          title: "Authentication Error",
          description: "There was an error during login. Please try again.",
          variant: "destructive",
        });
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [toast]);
};
