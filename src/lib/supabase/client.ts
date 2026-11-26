// Supabase client (browser only)
// Reads public Supabase URL and anon key from environment variables.
// This file is used by client‑side components to interact with the
// `public.flatmate_requirements` table.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/,"") ?? "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
