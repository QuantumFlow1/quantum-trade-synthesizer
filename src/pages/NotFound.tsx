
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background">
      <div className="glass-panel p-8 space-y-6 animate-in text-center max-w-md mx-auto">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-xl text-muted-foreground">
            Oeps! Deze pagina bestaat niet
          </p>
          <p className="text-sm text-muted-foreground/80">
            Het pad "{location.pathname}" kon niet worden gevonden
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/50 transition-all duration-300 ease-in-out hover:scale-105"
        >
          <Home className="w-4 h-4 mr-2" />
          Terug naar Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

