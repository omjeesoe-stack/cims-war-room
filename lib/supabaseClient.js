
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://adkrfizzwqekogiiruzf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3JmaXp6d3Fla29naWlydXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDkxMDYsImV4cCI6MjA4NDU4NTEwNn0.xs9qs9HUCd-y5IGZIJrH_yIlW0XyLJV4DTcRTgLAg3I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
