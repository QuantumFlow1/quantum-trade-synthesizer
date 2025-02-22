
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: React.ReactNode;
  componentName?: string;
  fallbackComponent?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TradingErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Trading component fout:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {this.props.componentName 
              ? `${this.props.componentName} ondervond een fout`
              : 'Er is iets misgegaan'}
          </AlertTitle>
          <AlertDescription>
            {this.state.error?.message || 'Probeer de pagina te vernieuwen'}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
