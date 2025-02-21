
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Button
        variant="outline"
        onClick={() => navigate("/admin")}
        className="mb-4 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/50 transition-all duration-300 ease-in-out hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Admin Panel
      </Button>

      <h1 className="text-2xl font-bold">Gebruikers Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
          <CardHeader>
            <CardTitle>Nieuwe Gebruikers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">127</p>
            <p className="text-sm text-muted-foreground">Deze maand</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
          <CardHeader>
            <CardTitle>Actieve Sessies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">456</p>
            <p className="text-sm text-muted-foreground">Nu online</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
          <CardHeader>
            <CardTitle>Gemiddelde Sessieduur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">24m</p>
            <p className="text-sm text-muted-foreground">Per gebruiker</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;
