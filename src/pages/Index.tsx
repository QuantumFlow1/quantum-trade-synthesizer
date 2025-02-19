
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginComponent } from "@/components/auth/LoginComponent";
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "@/components/AdminPanel";
import MarketOverview from '@/components/MarketOverview';
import TradeControls from '@/components/TradeControls';
import RiskManagement from '@/components/RiskManagement';
import AutoTrading from '@/components/AutoTrading';

const Index = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  // Handle hash fragment for OAuth redirects
  useEffect(() => {
    let isSubscribed = true;

    const handleHashFragment = async () => {
      if (!isSubscribed) return;

      const currentUrl = window.location.href;
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
        // Remove the hash and search params without triggering a reload
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

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, []); 

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

  // Voor admin gebruikers, toon AdminPanel
  if (userProfile.role === 'admin' || userProfile.role === 'super_admin') {
    return <AdminPanel />;
  }

  // Voor normale gebruikers, toon trading interface
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <MarketOverview />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TradeControls />
          <RiskManagement />
        </div>
        <AutoTrading />
      </div>
    </div>
  );
};

export default Index;
