
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Button
        variant="outline"
        onClick={() => navigate("/admin")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Admin Panel
      </Button>

      <h1 className="text-2xl font-bold">Platform Overzicht</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Actieve Gebruikers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,234</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Platform Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">99.9%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dagelijkse Transacties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5,678</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
