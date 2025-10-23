import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Task = {
  rowguid: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  due_date: string | null;
  created_by: string | null;
  partner_id: string | null;
  created_at: string;
  updated_at: string;
  created_by_user?: {
    username: string;
    email: string;
  };
};

export type Comment = {
  rowguid: string;
  task_id: string;
  user_id: string | null;
  content: string;
  created_at: string;
};

export type Attachment = {
  rowguid: string;
  task_id: string;
  filename: string;
  url: string;
  created_at: string;
};
