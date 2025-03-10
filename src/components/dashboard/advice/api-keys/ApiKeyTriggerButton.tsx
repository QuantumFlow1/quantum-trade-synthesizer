
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { SheetTrigger } from "@/components/ui/sheet";

export function ApiKeyTriggerButton() {
  return (
    <SheetTrigger asChild>
      <Button 
        className="w-full mb-2" 
        variant="outline" 
        size="sm"
      >
        <Key size={16} className="mr-2" />
        API Sleutels Configureren
      </Button>
    </SheetTrigger>
  );
}
