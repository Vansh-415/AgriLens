import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-earth-50 text-earth-900">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold mb-2 text-center">Something went wrong</h1>
          <p className="text-earth-600 max-w-md text-center mb-8">
            An unexpected error occurred. We've been notified. You can try refreshing the page or going back home.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              Go to Homepage
            </Button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-12 p-4 bg-earth-100 rounded-md overflow-auto max-w-4xl text-left text-xs text-earth-800">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
