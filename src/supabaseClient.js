import { createClient } from '@supabase/supabase-js';

// ดึงกุญแจวิเศษออกมาจากตู้เซฟ (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// สร้างตัวแทนสำหรับคุยกับ Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);