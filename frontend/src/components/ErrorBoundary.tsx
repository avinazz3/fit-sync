import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    console.log("[ErrorBoundary] getDerivedStateFromError caught:", error);
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] componentDidCatch caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ padding: 20, textAlign: "center", color: "red" }}>
          <h1>Something went wrong with the 3D Model.</h1>
          <p>{this.state.error?.message || "No error message available."}</p>
          <details style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
            {this.state.errorInfo?.componentStack || "No component stack."}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
