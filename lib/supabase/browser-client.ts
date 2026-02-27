"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";


type SupabaseShema = Record<string, any>;

let client: SupabaseClient<SupabaseShema> | null = null;

export function getSupabaseBrowserClient() {

    if(client){
        return client;
    }

  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing Supabase credentials are missing "
      );
    }

    client = createBrowserClient<SupabaseShema>(supabaseUrl, supabaseAnonKey);
  }
  return client;
}