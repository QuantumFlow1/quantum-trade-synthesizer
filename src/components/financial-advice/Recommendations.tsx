
import { AlertCircle } from "lucide-react";

export const Recommendations = () => {
  return (
    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Aanbevelingen
      </h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• Overweeg obligatie allocatie te verhogen voor meer stabiliteit</li>
        <li>• Crypto exposure verminderen gezien huidige marktvolatiliteit</li>
        <li>• Spreid aandelen positie over meerdere sectoren</li>
        <li>• Implementeer stop-loss orders voor risicovolle posities</li>
      </ul>
    </div>
  );
};
