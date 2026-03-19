import { useState } from 'react';

const priorities = ['urgent', 'high', 'medium', 'low'];
const statuses = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];

const priorityColors = {
  urgent: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400'
};

const FilterBar = ({ filters, onChange, onClear }) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showFilters || activeFilterCount > 0
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white text-indigo-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Clear filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700 flex flex-wrap gap-6">
          {/* Priority filter */}
          <div>
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Priority</label>
            <div className="flex gap-2 flex-wrap">
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => onChange({ ...filters, priority: filters.priority === p ? '' : p })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    filters.priority === p
                      ? 'bg-indigo-600 text-white'
                      : `bg-gray-800 ${priorityColors[p]} hover:bg-gray-700`
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Status</label>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => onChange({ ...filters, status: filters.status === s ? '' : s })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    filters.status === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Due date filter */}
          <div>
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Due Date</label>
            <div className="flex gap-2">
              {[
                { label: 'Overdue', value: 'overdue' },
                { label: 'Today', value: 'today' },
                { label: 'This week', value: 'week' }
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => onChange({ ...filters, dueDate: filters.dueDate === d.value ? '' : d.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.dueDate === d.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;