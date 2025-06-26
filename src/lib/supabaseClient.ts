// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // ถ้าคุณต้องการให้ล็อกอินค้างไว้ ให้ลบส่วนนี้ออก
    // ถ้าต้องการให้ล็อกอินใหม่ทุกครั้งที่รีเฟรช ให้คงไว้
    persistSession: false, 
  },
});