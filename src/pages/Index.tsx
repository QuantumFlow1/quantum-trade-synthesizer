
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import AdminPanel from "@/components/AdminPanel";
import { LoginComponent } from "@/components/auth/LoginComponent";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  // Handle hash fragment for OAuth redirects
  useEffect(() => {
    const handleHashFragment = async () => {
      if (window.location.hash || window.location.search) {
        const hasError = window.location.search.includes('error');
        if (hasError) {
          const searchParams = new URLSearchParams(window.location.search);
          const errorDescription = searchParams.get('error_description');
          toast({
            title: "Authenticatie Error",
            description: errorDescription?.replace(/\+/g, ' ') || "Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.",
            variant: "destructive",
          });
        }
        // Remove the hash and search params without triggering a reload
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    handleHashFragment().catch(error => {
      console.error('Error handling hash fragment:', error);
      toast({
        title: "Authenticatie Error",
        description: "Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.",
        variant: "destructive",
      });
    });
  }, [toast]);

  // Als er geen gebruiker is ingelogd, toon login scherm
  if (!user) {
    return <LoginComponent />;
  }

  // Als er een gebruiker is maar nog geen profiel, toon laadscherm
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Even geduld...</h1>
          <p className="text-muted-foreground">
            Je profiel wordt geladen.
          </p>
        </div>
      </div>
    );
  }

  // Toon het AdminPanel voor alle ingelogde gebruikers
  return <AdminPanel />;
};

export default Index;
