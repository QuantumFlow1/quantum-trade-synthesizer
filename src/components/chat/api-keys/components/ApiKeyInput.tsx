
import { Input } from '@/components/ui/input';

interface ApiKeyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  description: string;
}

export function ApiKeyInput({ label, value, onChange, placeholder, description }: ApiKeyInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Input 
        type="password" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
      />
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
