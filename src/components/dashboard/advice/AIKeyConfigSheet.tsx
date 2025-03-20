
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Key, Shield, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

interface AIKeyConfigSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onManualCheck?: () => void;
}

export function AIKeyConfigSheet({ isOpen, onOpenChange, onManualCheck }: AIKeyConfigSheetProps) {
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsCheckingAdmin(true);
        
        // Check if user is logged in first
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          setIsAdmin(false);
          setIsCheckingAdmin(false);
          return;
        }
        
        // Check for admin role
        const { data, error } = await supabase.rpc('has_role', {
          user_id: authData.user.id,
          role: 'admin'
        });
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    if (isOpen) {
      checkAdminStatus();
      loadKeysFromStorage();
    }
  }, [isOpen]);
  
  // Load saved API keys on component mount
  const loadKeysFromStorage = () => {
    const savedOpenAI = localStorage.getItem('openaiApiKey') || '';
    const savedClaude = localStorage.getItem('claudeApiKey') || '';
    const savedGemini = localStorage.getItem('geminiApiKey') || '';
    const savedDeepseek = localStorage.getItem('deepseekApiKey') || '';
    const savedGroq = localStorage.getItem('groqApiKey') || '';
    
    console.log('Loading API keys from localStorage:', {
      openai: savedOpenAI ? 'present' : 'not found',
      claude: savedClaude ? 'present' : 'not found',
      gemini: savedGemini ? 'present' : 'not found',
      deepseek: savedDeepseek ? 'present' : 'not found',
      groq: savedGroq ? 'present' : 'not found'
    });
    
    setOpenaiKey(savedOpenAI);
    setClaudeKey(savedClaude);
    setGeminiKey(savedGemini);
    setDeepseekKey(savedDeepseek);
    setGroqKey(savedGroq);
  };
  
  const navigateToAdminPanel = () => {
    window.location.href = '/admin/api-keys';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          className="w-full mb-2" 
          variant="outline" 
          size="sm"
        >
          <Key size={16} className="mr-2" />
          API Sleutels Status
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>API Sleutels Status</SheetTitle>
        </SheetHeader>
        
        {isCheckingAdmin ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Controleert admin status...</span>
          </div>
        ) : (
          <div className="py-4">
            <Alert className="bg-amber-50 border-amber-200 mb-4">
              <Shield className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-800">
                <p className="font-medium mb-2">Alleen voor Administrators</p>
                <p>API Sleutels kunnen alleen door administrators worden geconfigureerd.</p>
                <p className="mt-2">De applicatie gebruikt door de administrator ingestelde API sleutels. Er is geen actie van uw kant nodig.</p>
              </AlertDescription>
            </Alert>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">API Sleutels Status:</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">OpenAI:</span>
                  <span className={openaiKey ? "text-green-600" : "text-gray-400"}>
                    {openaiKey ? "Beschikbaar" : "Niet beschikbaar"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Claude:</span>
                  <span className={claudeKey ? "text-green-600" : "text-gray-400"}>
                    {claudeKey ? "Beschikbaar" : "Niet beschikbaar"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Groq:</span>
                  <span className={groqKey ? "text-green-600" : "text-gray-400"}>
                    {groqKey ? "Beschikbaar" : "Niet beschikbaar"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">DeepSeek:</span>
                  <span className={deepseekKey ? "text-green-600" : "text-gray-400"}>
                    {deepseekKey ? "Beschikbaar" : "Niet beschikbaar"}
                  </span>
                </li>
              </ul>
            </div>
            
            {isAdmin ? (
              <Button 
                className="w-full mt-6" 
                onClick={navigateToAdminPanel}
              >
                Ga naar Admin API Sleutels
              </Button>
            ) : (
              <Button 
                className="w-full mt-6" 
                variant="outline"
                onClick={() => {
                  onManualCheck?.();
                  onOpenChange(false);
                }}
              >
                Controleer API verbindingen
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
