
import { useAuth } from "@/components/auth/AuthProvider";
import AdminPanel from "@/components/AdminPanel";
import { LoginComponent } from "@/components/auth/LoginComponent";
import { useEffect } from "react";

const Index = () => {
  const { user, userProfile, isAdmin } = useAuth();

  // Als er geen gebruiker is ingelogd, toon login scherm
  if (!user) {
    return <LoginComponent />;
  }

  // Als de gebruiker geen admin is, toon een bericht
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Geen Toegang</h1>
          <p className="text-muted-foreground">
            Je hebt geen toegangsrechten voor deze pagina.
          </p>
        </div>
      </div>
    );
  }

  // Als de gebruiker een admin is, toon het AdminPanel
  return <AdminPanel />;
};

export default Index;
