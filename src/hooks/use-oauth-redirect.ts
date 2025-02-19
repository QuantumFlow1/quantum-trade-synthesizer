
import { useEffect } from "react";
import { useToast } from "./use-toast";

export const useOAuthRedirect = () => {
  const { toast } = useToast();

  useEffect(() => {
    let isSubscribed = true;

    const handleHashFragment = async () => {
      if (!isSubscribed) return;

      const hasHash = window.location.hash;
      const searchParams = window.location.search;

      if (hasHash || searchParams) {
        const hasError = searchParams.includes('error');
        if (hasError) {
          const params = new URLSearchParams(searchParams);
          const errorDescription = params.get('error_description');
          if (isSubscribed) {
            toast({
              title: "Authenticatie Error",
              description: errorDescription?.replace(/\+/g, ' ') || "Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.",
              variant: "destructive",
            });
          }
        }
        if (isSubscribed) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    handleHashFragment().catch(error => {
      if (isSubscribed) {
        console.error('Error handling hash fragment:', error);
        toast({
          title: "Authenticatie Error",
          description: "Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.",
          variant: "destructive",
        });
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);
};
