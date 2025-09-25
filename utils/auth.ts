import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Authentication helper for API routes
export async function validateAdminAuth() {
  // Get cookies and create Supabase client manually
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // Get the access token from cookies
  const accessToken = cookieStore.get('sb-access-token')?.value;
  
  if (!accessToken) {
    throw new Error('Unauthorized - Admin login required');
  }
  
  // Create Supabase client with the access token
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
  
  // Verify the session
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Unauthorized - Admin login required');
  }
  
  return { session: { user, access_token: accessToken }, supabase };
}

// Optional: Create a middleware-like function for API routes
export async function withAuth<T>(
  handler: (session: any, supabase: any) => Promise<T>
): Promise<T> {
  const { session, supabase } = await validateAdminAuth();
  return handler(session, supabase);
}
