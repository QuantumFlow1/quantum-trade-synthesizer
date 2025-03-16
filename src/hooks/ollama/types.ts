
export interface ConnectionStatus {
  connected: boolean;
  error?: string;
  modelsCount?: number;
}

export interface UseOllamaDockerConnectReturn {
  dockerAddress: string;
  setDockerAddress: (address: string) => void;
  customAddress: string;
  setCustomAddress: (address: string) => void;
  isConnecting: boolean;
  connectionStatus: ConnectionStatus | null;
  connectToDocker: (address: string) => Promise<void>;
  useServerSideProxy: boolean;
  setUseServerSideProxy: (enabled: boolean) => void;
  currentOrigin: string;
  autoRetryEnabled: boolean;
  toggleAutoRetry: () => void;
  isLocalhost: boolean;
}
