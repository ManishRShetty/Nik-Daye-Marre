'use client';

import React from 'react';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm z-50 text-white p-8">
          <div className="bg-zinc-900 border border-red-500/50 p-6 rounded-2xl max-w-lg w-full">
            <h2 className="text-xl font-bold text-red-400 mb-2">3D Scene Error</h2>
            <p className="text-sm text-gray-300 font-mono overflow-auto max-h-48 bg-black/50 p-3 rounded-lg">
              {this.state.error?.message || "Unknown error occurred"}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
