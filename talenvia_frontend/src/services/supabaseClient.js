import { createClient } from "@supabase/supabase-js";
import { getEnvConfig } from "../config/env";

let supabaseSingleton = undefined; // undefined = not initialized, null = intentionally disabled (missing env)

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Returns a singleton Supabase client or null if not configured. */
  if (supabaseSingleton !== undefined) return supabaseSingleton;

  const { supabaseUrl, supabaseKey } = getEnvConfig();
  if (!supabaseUrl || !supabaseKey) {
    supabaseSingleton = null;
    return null;
  }

  supabaseSingleton = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return supabaseSingleton;
}
