import { supabase, Task } from '../lib/supabase';

export type TaskFilters = {
  priority?: 'high' | 'medium' | 'low';
  status?: string;
  search?: string;
  due_date_gte?: string;
  due_date_lte?: string;
  ordering?: string;
};

export const fetchTasks = async (filters: TaskFilters = {}): Promise<Task[]> => {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      created_by_user:users!tasks_created_by_fkey(username, email)
    `);

  if (filters.priority) {
    query = query.eq('priority', filters.priority);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.due_date_gte) {
    query = query.gte('due_date', filters.due_date_gte);
  }

  if (filters.due_date_lte) {
    query = query.lte('due_date', filters.due_date_lte);
  }

  if (filters.ordering) {
    const isDescending = filters.ordering.startsWith('-');
    const field = isDescending ? filters.ordering.substring(1) : filters.ordering;
    query = query.order(field, { ascending: !isDescending });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const fetchTaskComments = async (taskId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const fetchTaskAttachments = async (taskId: string) => {
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};
