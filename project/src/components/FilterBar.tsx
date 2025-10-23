import { Search, SlidersHorizontal } from 'lucide-react';
import { TaskFilters } from '../api/tasks';

type FilterBarProps = {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
};

export const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value || undefined });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({
      ...filters,
      priority: value ? (value as 'high' | 'medium' | 'low') : undefined
    });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value || undefined });
  };

  const handleOrderingChange = (value: string) => {
    onFilterChange({ ...filters, ordering: value || undefined });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-slate-600" />
        <h2 className="font-semibold text-slate-800">Filtros e Pesquisa</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filters.priority || ''}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Todas as prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>

        <select
          value={filters.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Progresso</option>
          <option value="completed">Concluída</option>
        </select>

        <select
          value={filters.ordering || ''}
          onChange={(e) => handleOrderingChange(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Mais recente</option>
          <option value="-created_at">Mais recente</option>
          <option value="created_at">Mais antiga</option>
          <option value="due_date">Prazo (próximo)</option>
          <option value="-due_date">Prazo (distante)</option>
          <option value="priority">Prioridade</option>
        </select>
      </div>
    </div>
  );
};
