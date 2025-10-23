import { Loader2 } from 'lucide-react';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-2 text-slate-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Carregando tarefas...</span>
      </div>
    </div>
  );
};
