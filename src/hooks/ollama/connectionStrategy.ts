
import { isLocalhostEnvironment, delay } from './connectionUtils';

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
  // Skip auto-retry if disabled
  if (!autoRetryEnabled) {
    console.log("Auto-retry is disabled, skipping automatic retry attempts");
    return;
  }
  
  // Only try local connections - don't attempt any remote connections
  console.log('Attempting only local Ollama connections');
  
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

/**
 * Determines the initial address to try based on environment
 */
export function getInitialConnectionAddress(): string {
  // Always use localhost for initial connection regardless of environment
  console.log('Using localhost:11434 as initial address (local only mode)');
  return 'http://localhost:11434';
}
