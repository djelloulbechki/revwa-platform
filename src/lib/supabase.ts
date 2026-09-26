import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

let supabase: SupabaseClient

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn(
    "[REVWA] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in Vercel / .env"
  )
  supabase = createClient("https://placeholder.supabase.co", "placeholder-key")
}

export { supabase }
