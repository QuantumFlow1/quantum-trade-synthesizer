
import { useAuth } from "@/components/auth/AuthProvider";
import AdminPanel from "@/components/AdminPanel";
import { LoginComponent } from "@/components/auth/LoginComponent";

const Index = () => {
  const { user, userProfile } = useAuth();

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
