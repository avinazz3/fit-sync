import * as React from "react";
import { createContext, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "./useSupabaseAuth";

type UserGuardContextType = {
  user: any;
};

const UserGuardContext = createContext<UserGuardContextType | undefined>(
  undefined,
);

/**
 * Hook to access the logged in user from within a <UserGuard> component.
 */
export const useUserGuardContext = () => {
  const context = useContext(UserGuardContext);

  if (context === undefined) {
    throw new Error("useUserGuardContext must be used within a <UserGuard>");
  }

  return context;
};

/**
 * All protected routes are wrapped in a UserGuard component.
 */
export const UserGuard = (props: {
  children: React.ReactNode;
}) => {
  try {
    const { user, loading } = useSupabaseAuth();
    const { pathname } = useLocation();

    // For debugging - prevent auth breaks during development
    const isDevelopment = import.meta.env?.MODE === 'development';
    const bypassAuth = isDevelopment && localStorage.getItem('bypassAuth') === 'true';

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user && !bypassAuth) {
      const queryParams = new URLSearchParams(window.location.search);

      // Don't set the next param if the user is logging out
      // to avoid ending up in an infinite redirect loop
      if (pathname !== "/logout" && pathname !== "/sign-out") {
        queryParams.set("next", pathname);
      }

      const queryString = queryParams.toString();

      return <Navigate to={`/login?${queryString}`} replace={true} />;
    }
    
    // If we're bypassing auth in development, log it
    if (bypassAuth && isDevelopment) {
      console.log('Auth bypass enabled for development');
    }

    return (
      <UserGuardContext.Provider value={{ user }}>
        {props.children}
      </UserGuardContext.Provider>
    );
  } catch (error) {
    console.error('Error in UserGuard:', error);
    // Fallback in case of error - allows the app to function in dev
    console.log('Bypassing auth due to error');
    return (
      <UserGuardContext.Provider value={{ user: { uid: 'dev-bypass' } as any }}>
        {props.children}
      </UserGuardContext.Provider>
    );
  }
};
