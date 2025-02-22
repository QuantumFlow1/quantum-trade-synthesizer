
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Props {
  children: React.ReactNode;
  componentName?: string;
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
    console.error('Trading component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <div className="space-y-1">
              <p className="font-medium">
                {this.props.componentName 
                  ? `${this.props.componentName} encountered an error`
                  : 'Something went wrong'}
              </p>
              <p className="text-sm text-destructive/80">
                {this.state.error?.message || 'Please try refreshing the page'}
              </p>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
