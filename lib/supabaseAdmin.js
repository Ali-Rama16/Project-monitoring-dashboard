import { createClient } from '@supabase/supabase-js'

// KHUSUS dipakai di server (pages/api/*) — JANGAN PERNAH diimport dari
// komponen atau halaman biasa, karena memakai service_role key yang
// harus dirahasiakan (bisa membaca/menulis semua data, melewati RLS).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})
