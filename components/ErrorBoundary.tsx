import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// FIX: The ErrorBoundary class component was not correctly implemented, causing TypeScript to fail to recognize properties like `this.state`, `this.props`, and `this.setState`. This was resolved by adding a constructor that calls `super(props)` and initializes the component's state. This correction also resolves the consequential type error in `index.tsx` where the `children` prop was not being recognized.
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // This lifecycle method runs after an error has been thrown by a descendant component.
    // It receives the error that was thrown as a parameter and should return a value to update state.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // This lifecycle method is also called after an error in a descendant component has been thrown.
    // It receives two parameters: the error that was thrown, and an object with a componentStack key.
    this.setState({ errorInfo });
    logger.error('ErrorBoundary', 'React render error caught!', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', margin: '20px', border: '1px solid red', borderRadius: '8px', backgroundColor: '#fff0f0' }}>
          <h1>Something went wrong.</h1>
          <p>An uncaught error occurred in the application. This has been logged to the console.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
           <button onClick={() => window.location.reload()} style={{marginTop: '10px', padding: '8px 16px', cursor: 'pointer'}}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;