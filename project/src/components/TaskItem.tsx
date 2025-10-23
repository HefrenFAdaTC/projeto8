import { Task } from '../lib/supabase';
import { Calendar, AlertCircle, User } from 'lucide-react';

type TaskItemProps = {
  task: Task;
};

const priorityConfig = {
  high: {
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700',
    icon: 'text-red-500',
    label: 'Alta'
  },
  medium: {
    bg: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    icon: 'text-amber-500',
    label: 'Média'
  },
  low: {
    bg: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: 'text-emerald-500',
    label: 'Baixa'
  }
};

export const TaskItem = ({ task }: TaskItemProps) => {
  const config = priorityConfig[task.priority];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sem prazo';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${config.bg}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-slate-800 text-lg flex-1">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.badge}`}>
            {config.label}
          </span>
          {task.status && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {task.status}
            </span>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-slate-600 mb-3 text-sm line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-slate-500">
        {task.due_date && (
          <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600' : ''}`}>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.due_date)}</span>
            {isOverdue && <AlertCircle className="w-4 h-4" />}
          </div>
        )}

        {task.created_by_user && (
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{task.created_by_user.username}</span>
          </div>
        )}
      </div>
    </div>
  );
};
