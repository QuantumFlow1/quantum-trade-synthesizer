
// Types for Ollama connection status
export interface ConnectionStatus {
  connected: boolean;
  modelsCount?: number;
  error?: string;
}

// Return type for useOllamaDockerConnect hook
export interface UseOllamaDockerConnectReturn {
  dockerAddress: string;
  setDockerAddress: (address: string) => void;
  customAddress: string;
  setCustomAddress: (address: string) => void;
  isConnecting: boolean;
  connectionStatus: ConnectionStatus | null;
  connectToDocker: (address: string) => Promise<boolean | void>;
  disconnectFromDocker: () => void;
  useServerSideProxy: boolean;
  setUseServerSideProxy: (value: boolean) => void;
  currentOrigin: string;
  autoRetryEnabled: boolean;
  toggleAutoRetry: () => void;
  isLocalhost: boolean;
}
