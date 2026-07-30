import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id?: string;
  type: 'quote' | 'financing' | 'distributor' | 'installer' | 'contact';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  model?: string;
  budget?: string;
  region?: string;
  partnership_type?: string;
  message?: string;
  created_at?: string;
}

export interface Reservation {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  model: string;
  stripe_session_id?: string;
  status: 'pending' | 'paid' | 'cancelled';
  amount: number;
  created_at?: string;
}
