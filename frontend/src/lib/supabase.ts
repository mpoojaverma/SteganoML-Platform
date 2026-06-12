import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl) {
  supabaseUrl = supabaseUrl.trim().replace(/\.+$/, "");
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-build-url.supabase.co",
  supabaseAnonKey || "placeholder-build-key"
);