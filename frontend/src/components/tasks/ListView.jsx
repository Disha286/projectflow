import { useState } from 'react';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskStatusAPI, deleteTaskAPI } from '../../api/tasks';
import toast from 'react-hot-toast';

const priorityConfig = {
  urgent: { color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', dot: 'bg-orange-400' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-400' },
  low: { color: 'text-green-400', bg: 'bg-green-500/10', dot: 'bg-green-400' },
};

const statusConfig = {
  backlog: { color: 'text-gray-400', bg: 'bg-gray-500/10', label: 'Backlog' },
  todo: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Todo' },
  in_progress: { color: 'text-indigo-400', bg: 'bg-indigo-500/10', label: 'In Progress' },
  in_review: { color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'In Review' },
  done: { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Done' },
};

const ListView = ({ tasks, projectId, onEditTask }) => {
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ taskId, status }) => updateTaskStatusAPI(taskId, status),
    onSuccess: () => queryClient.invalidateQueries(['tasks', projectId])
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: (taskId) => deleteTaskAPI(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', projectId]);
      toast.success('Task deleted!');
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (sortBy === 'dueDate') {
      aVal = aVal ? new Date(aVal) : new Date('9999');
      bVal = bVal ? new Date(bVal) : new Date('9999');
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => (
    <svg
      className={`w-3.5 h-3.5 ml-1 transition-all ${sortBy === field ? 'text-indigo-400' : 'text-gray-600'}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d={sortOrder === 'asc' && sortBy === field ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
    </svg>
  );

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-3">📋</div>
        <p className="text-gray-400">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-800 bg-gray-800/50">
        <div className="col-span-5 flex items-center">
          <button
            onClick={() => handleSort('title')}
            className="flex items-center text-xs font-medium text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            Task <SortIcon field="title" />
          </button>
        </div>
        <div className="col-span-2 flex items-center">
          <button
            onClick={() => handleSort('status')}
            className="flex items-center text-xs font-medium text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            Status <SortIcon field="status" />
          </button>
        </div>
        <div className="col-span-2 flex items-center">
          <button
            onClick={() => handleSort('priority')}
            className="flex items-center text-xs font-medium text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            Priority <SortIcon field="priority" />
          </button>
        </div>
        <div className="col-span-2 flex items-center">
          <button
            onClick={() => handleSort('dueDate')}
            className="flex items-center text-xs font-medium text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            Due Date <SortIcon field="dueDate" />
          </button>
        </div>
        <div className="col-span-1" />
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-800">
        {sortedTasks.map((task) => {
          const priority = priorityConfig[task.priority];
          const status = statusConfig[task.status];
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

          return (
            <div
              key={task._id}
              className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-800/50 transition-colors group items-center"
            >
              {/* Task title */}
              <div className="col-span-5 flex items-center gap-3">
                <button
                  onClick={() => updateStatus({
                    taskId: task._id,
                    status: task.status === 'done' ? 'todo' : 'done'
                  })}
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    task.status === 'done'
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-600 hover:border-indigo-500'
                  }`}
                >
                  {task.status === 'done' && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => onEditTask(task)}
                  className={`text-sm font-medium text-left hover:text-indigo-400 transition-colors truncate ${
                    task.status === 'done' ? 'line-through text-gray-500' : 'text-white'
                  }`}
                >
                  {task.title}
                </button>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus({ taskId: task._id, status: e.target.value })}
                  className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${status.bg} ${status.color}`}
                  style={{ appearance: 'none' }}
                >
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <option key={value} value={value} className="bg-gray-800 text-white">
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${priority.bg} ${priority.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                  {task.priority}
                </span>
              </div>

              {/* Due date */}
              <div className="col-span-2">
                {task.dueDate ? (
                  <span className={`text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                    {isOverdue && '⚠️ '}
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </span>
                ) : (
                  <span className="text-gray-600 text-xs">No due date</span>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => deleteTask(task._id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1 rounded"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-800/30">
        <span className="text-gray-500 text-xs">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

export default ListView;