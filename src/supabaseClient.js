import { createClient } from '@supabase/supabase-js';

// ดึงกุญแจวิเศษออกมาจากตู้เซฟ (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ถ้าไม่ครบ — ไม่สร้าง client (createClient จะ throw "supabaseUrl is required" ทำให้แอปเปิดไม่ได้)
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
