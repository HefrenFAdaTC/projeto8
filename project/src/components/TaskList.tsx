import { Task } from '../lib/supabase';
import { TaskItem } from './TaskItem';
import { ClipboardList } from 'lucide-react';

type TaskListProps = {
  tasks: Task[];
};

export const TaskList = ({ tasks }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
        <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-slate-500">
          Não há tarefas que correspondam aos filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.rowguid} task={task} />
      ))}
    </div>
  );
};
