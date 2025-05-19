import { useState, useEffect } from 'react';
import { getCurrentUser, onAuthStateChange } from './supabase-auth';

export function useSupabaseAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if there's a current user
    const loadUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser || null);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
    
    // Subscribe to auth changes
    const { data: authListener } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    // Cleanup subscription
    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);
  
  return { user, loading };
}
