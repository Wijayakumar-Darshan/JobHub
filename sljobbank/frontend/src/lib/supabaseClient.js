import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If Supabase isn't configured yet, chat falls back to polling (see ChatPage) -
// the rest of the app works fine without it.
export const supabase = (url && anonKey) ? createClient(url, anonKey) : null
export const isChatRealtimeConfigured = !!supabase
