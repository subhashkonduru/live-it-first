import React from 'react';

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // You can integrate with logging services here
    // For now, just log to console
    console.error('Captured render error in ErrorBoundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-6">
          <div className="bg-destructive/10 border border-destructive p-4 rounded">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mt-2">An unexpected error occurred while rendering this page.</p>
            <details className="mt-2 text-xs text-muted-foreground">{this.state.error?.message}</details>
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactNode;
  }
}
