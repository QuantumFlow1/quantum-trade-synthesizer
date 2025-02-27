
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchAdminApiKey } from '@/components/chat/services/utils/apiHelpers'
import { hasApiKeyAccess } from '@/utils/auth-utils'

export const useAuthSession = (
  setSession: (session: any) => void,
  setUser: (user: any) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  // Function to load admin API keys if user has access
  const loadAdminApiKeys = async (userProfile: any) => {
    if (!userProfile || !hasApiKeyAccess(userProfile)) {
      console.log('User does not have API key access, skipping admin key loading');
      return;
    }
    
    console.log('User has API key access, loading admin keys if needed');
    
    try {
      // Check if keys are already in localStorage
      const hasOpenaiKey = !!localStorage.getItem('openaiApiKey');
      const hasClaudeKey = !!localStorage.getItem('claudeApiKey');
      const hasGeminiKey = !!localStorage.getItem('geminiApiKey');
      const hasDeepseekKey = !!localStorage.getItem('deepseekApiKey');
      
      // Only fetch keys that we don't have yet
      if (!hasOpenaiKey) {
        const openaiKey = await fetchAdminApiKey('openai');
        if (openaiKey) {
          console.log('Found admin OpenAI key, storing in localStorage');
          localStorage.setItem('openaiApiKey', openaiKey);
        }
      }
      
      if (!hasClaudeKey) {
        const claudeKey = await fetchAdminApiKey('claude');
        if (claudeKey) {
          console.log('Found admin Claude key, storing in localStorage');
          localStorage.setItem('claudeApiKey', claudeKey);
        }
      }
      
      if (!hasGeminiKey) {
        const geminiKey = await fetchAdminApiKey('gemini');
        if (geminiKey) {
          console.log('Found admin Gemini key, storing in localStorage');
          localStorage.setItem('geminiApiKey', geminiKey);
        }
      }
      
      if (!hasDeepseekKey) {
        const deepseekKey = await fetchAdminApiKey('deepseek');
        if (deepseekKey) {
          console.log('Found admin DeepSeek key, storing in localStorage');
          localStorage.setItem('deepseekApiKey', deepseekKey);
        }
      }
      
      console.log('Admin API key loading complete');
    } catch (error) {
      console.error('Error loading admin API keys:', error);
    }
  };
  
  // Load user profile function
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      console.log('User profile loaded:', data);
      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get the current session on load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session)
      setSession(session)
      setUser(session?.user ?? null)
      
      // If we have a session, load the user profile and API keys
      if (session?.user) {
        const userProfile = await loadUserProfile(session.user.id);
        if (userProfile) {
          await loadAdminApiKeys(userProfile);
        }
      }
      
      setIsLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      
      // On sign in, load API keys
      if (_event === 'SIGNED_IN' && session?.user) {
        const userProfile = await loadUserProfile(session.user.id);
        if (userProfile) {
          await loadAdminApiKeys(userProfile);
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setSession, setUser, setIsLoading])
}
