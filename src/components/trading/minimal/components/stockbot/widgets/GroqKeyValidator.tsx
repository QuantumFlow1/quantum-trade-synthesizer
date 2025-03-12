
import { AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface GroqKeyValidatorProps {
  apiKey: string;
  onValidationComplete?: (isValid: boolean) => void;
}

export const GroqKeyValidator = ({ apiKey, onValidationComplete }: GroqKeyValidatorProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateGroqKey = async () => {
    if (!apiKey || apiKey.trim().length < 10) {
      setIsValid(false);
      setErrorMessage('API key is too short or empty');
      onValidationComplete?.(false);
      return;
    }

    setIsValidating(true);
    setErrorMessage(null);

    try {
      // Try to make a simple models list request to Groq API
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsValid(true);
        onValidationComplete?.(true);
      } else {
        const errorData = await response.json();
        setIsValid(false);
        setErrorMessage(errorData.error?.message || `API error: ${response.status}`);
        onValidationComplete?.(false);
      }
    } catch (error) {
      console.error('Error validating Groq API key:', error);
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : 'Network error');
      onValidationComplete?.(false);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="mt-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={validateGroqKey}
        disabled={isValidating || !apiKey}
        className="w-full"
      >
        {isValidating ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2">⟳</span>
            Validating...
          </span>
        ) : (
          'Validate API Key'
        )}
      </Button>

      {isValid === true && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex items-center">
          <Check size={16} className="mr-2" />
          API key is valid
        </div>
      )}

      {isValid === false && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {errorMessage || 'Invalid API key'}
        </div>
      )}
    </div>
  );
};
