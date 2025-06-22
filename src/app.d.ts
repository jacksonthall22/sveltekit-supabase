import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from './database.types.ts' // import generated types

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>
      supabaseAdmin: SupabaseClient<Database>
      // `session` and `user` will always be set, but may be anonymous when user is logged out
      safeGetSession: () => Promise<{ session: Session; user: User }>
      session: Session
      user: User
    }
    interface PageData {
      session: Session
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
