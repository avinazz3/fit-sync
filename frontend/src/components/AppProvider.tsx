import React, { ReactNode, Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";


import { Toaster } from "sonner";

// Define AppProviderProps interface
interface AppProviderProps {
  children: ReactNode;
}



// Simple inline ErrorFallback component
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4">
      <p className="text-red-500 font-semibold">Something went wrong:</p>
      <pre className="text-sm text-red-700 whitespace-pre-wrap">{error.message}</pre>
      <button 
        onClick={resetErrorBoundary} 
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

/**
 * A provider wrapping the whole app.
 *
 * You can add multiple providers here by nesting them,
 * and they will all be applied to the app.
 *
 * Note: ThemeProvider is already included in AppWrapper.tsx and does not need to be added here.
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <ErrorBoundary FallbackComponent={ErrorFallback}> 
            <TooltipProvider delayDuration={100}> 
              <div> {/* Wrap Outlet with MainLayout */} 
                  <Outlet /> 
                </div> 
                <Toaster richColors closeButton /> 
            </TooltipProvider> 
      </ErrorBoundary> 
    </Suspense> 
  );
}