
import { isLocalhostEnvironment, isGitpodEnvironment, delay } from './connectionUtils';
import { toast } from "@/components/ui/use-toast";

/**
 * Handles the automatic retry strategy for Ollama connections
 */
export async function handleConnectionFailure({
  error,
  address,
  connectionAttempts,
  alternativePortsAttempted,
  autoRetryEnabled,
  connectToDocker,
  setConnectionAttempts,
  setAlternativePortsAttempted,
  suppressToast = false
}: {
  error: unknown;
  address: string;
  connectionAttempts: number;
  alternativePortsAttempted: boolean;
  autoRetryEnabled: boolean;
  connectToDocker: (address: string) => Promise<boolean | void>;
  setConnectionAttempts: (updater: (prev: number) => number) => void;
  setAlternativePortsAttempted: (value: boolean) => void;
  suppressToast?: boolean;
}) {
  // Display error toast only if not suppressed
  if (!suppressToast) {
    toast({
      title: "Connection failed",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
  }

  // Skip auto-retry if disabled
  if (!autoRetryEnabled) {
    console.log("Auto-retry is disabled, skipping automatic retry attempts");
    return;
  }
  
  // Local development specific retry sequence
  if (isLocalhostEnvironment()) {
    console.log('Environment detected as localhost');
    
    if (address.includes('localhost') && connectionAttempts <= 1) {
      console.log('localhost connection failed, trying 127.0.0.1...');
      setTimeout(() => {
        connectToDocker('http://127.0.0.1:11434');
      }, 1000);
      setConnectionAttempts(prev => prev + 1);
    } 
    else if (address.includes('127.0.0.1') && connectionAttempts <= 2) {
      console.log('127.0.0.1 connection failed, trying host.docker.internal...');
      setTimeout(() => {
        connectToDocker('http://host.docker.internal:11434');
      }, 1000);
      setConnectionAttempts(prev => prev + 1);
    }
    else if (!alternativePortsAttempted) {
      console.log('Standard addresses failed, trying alternative port 11435...');
      setTimeout(() => {
        connectToDocker('http://localhost:11435');
      }, 1000);
      setAlternativePortsAttempted(true);
    }
  }
  // Non-local retry strategy
  else {
    // If this was a CORS error, automatically try the container name
    const errorMessage = error instanceof Error ? error.message : '';
    
    if (errorMessage.includes('CORS') && connectionAttempts <= 1) {
      console.log('CORS error detected, trying container name as fallback...');
      setTimeout(() => {
        connectToDocker('http://ollama:11434');
      }, 1000);
      setConnectionAttempts(prev => prev + 1);
    } 
    // If we've tried multiple attempts but still no connection, try alternative ports
    else if (connectionAttempts > 1 && !alternativePortsAttempted) {
      console.log('Multiple connection attempts failed, trying alternative ports...');
      setTimeout(() => {
        connectToDocker('http://localhost:11435');
      }, 1000);
      setAlternativePortsAttempted(true);
    }
    // If we already tried the first alternative port, try the second one
    else if (alternativePortsAttempted && address.includes('11435')) {
      console.log('Port 11435 failed, trying port 37321...');
      setTimeout(() => {
        connectToDocker('http://localhost:37321');
      }, 1000);
    }
  }
}

/**
 * Determines the initial address to try based on environment
 */
export function getInitialConnectionAddress(): string {
  // Add more informative logging
  console.log('Determining initial connection address...');
  console.log('Is localhost environment?', isLocalhostEnvironment());
  console.log('Is Gitpod environment?', isGitpodEnvironment());
  console.log('Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'unknown');
  
  if (isLocalhostEnvironment()) {
    console.log('Using localhost:11434 as initial address');
    return 'http://localhost:11434';
  } else if (isGitpodEnvironment()) {
    // Try container name first since that's most likely to work in Gitpod
    console.log('Using ollama:11434 as initial address (Gitpod environment)');
    return 'http://ollama:11434';
  } else {
    // Default connection attempt
    console.log('Using localhost:11434 as default initial address');
    return 'http://localhost:11434';
  }
}
