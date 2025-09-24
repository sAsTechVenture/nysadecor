import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !serviceRole || !anonKey) {
    console.log("Missing Supabase environment variables:", {
        supabaseUrl,
        serviceRole,
        anonKey,
    });
  throw new Error(
    "Supabase URL, Service Role Key, and Anon Key must be defined in environment variables."
  );
}

// Admin client (server-side, full access)
export const supabaseAdmin = createClient(supabaseUrl, serviceRole);

// Public client (client-side, limited access)
export const supabase = createClient(supabaseUrl, anonKey);