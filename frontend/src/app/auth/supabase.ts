// Create a mock client to use before Supabase is loaded
const createEmptyClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Supabase not initialized' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not initialized' } }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { unsubscribe: () => {} }, error: null })
  }
});

// Initialize with empty client
let supabase: any = createEmptyClient();

// Function to initialize Supabase safely
const initSupabase = async () => {
  // Don't initialize on server
  if (typeof window === 'undefined') return;
  
  try {
    // Using dynamic import instead of require
    const supabaseModule = await import('@supabase/supabase-js');
    const { createClient } = supabaseModule;
    
    // Use the environment variables - prioritize Vite variables
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 
                      import.meta.env?.NEXT_PUBLIC_SUPABASE_URL || 
                      '';
                      
    const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 
                       import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       '';

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or key is missing');
      return;
    }
    
    // Create the client
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase initialized successfully');
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
  }
};

// Initialize if possible
initSupabase().catch(err => {
  console.error('Error during Supabase initialization:', err);
});

// Export the supabase client (will be the mock one until initialization completes)
export { supabase };
