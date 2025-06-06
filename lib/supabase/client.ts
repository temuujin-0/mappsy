// lib/supabase/client.ts - Илүү бат бөх байлгахын тулд (хөгжүүлэлтийн үед алдааг барих зорилгоор)
import { createBrowserClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Зөвхөн хөгжүүлэлтийн үед л энэ алдааг гаргах нь зүйтэй.
  // Production build үед энэ алдаа гарахгүй байх ёстой.
  if (process.env.NODE_ENV !== 'production') {
    console.error("Supabase URL or Anon Key is missing. Please check your .env.local file.");
  }
  // Эсвэл алдаа шидэх эсвэл fallback утга өгөх
  throw new Error("Supabase environment variables are not set correctly.");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Хэрэв та server side-д ашиглах бол тусдаа клиент үүсгэх хэрэгтэй.
// Жишээ нь: lib/supabase/server.ts (Server Components эсвэл API routes-д зориулсан)
/*
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
*/