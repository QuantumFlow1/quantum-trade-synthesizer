
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeyInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  description: string;
}

export function ApiKeyInput({ 
  id, 
  label, 
  placeholder, 
  value, 
  onChange, 
  description 
}: ApiKeyInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input 
        id={id}
        type="password" 
        placeholder={placeholder} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
