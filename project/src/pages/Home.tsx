import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { Task } from '../lib/supabase';
import { fetchTasks, TaskFilters } from '../api/tasks';
import { TaskList } from '../components/TaskList';
import { FilterBar } from '../components/FilterBar';
import { Loading } from '../components/Loading';

export const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks(filters);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const handleRefresh = () => {
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-800">
                Minhas Tarefas
              </h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
          <p className="text-slate-600">
            Gerencie e acompanhe todas as suas tarefas em um só lugar
          </p>
        </header>

        <FilterBar filters={filters} onFilterChange={setFilters} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Erro ao carregar tarefas</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? <Loading /> : <TaskList tasks={tasks} />}

        {!loading && tasks.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            {tasks.length} {tasks.length === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}
          </div>
        )}
      </div>
    </div>
  );
};
