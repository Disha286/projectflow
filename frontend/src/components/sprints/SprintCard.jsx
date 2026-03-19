import { motion } from 'framer-motion';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { startSprintAPI, completeSprintAPI, deleteSprintAPI } from '../../api/sprints';

const statusConfig = {
  planning: { label: 'Planning', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
  active: { label: 'Active', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  completed: { label: 'Completed', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' }
};

const SprintCard = ({ sprint, projectId, tasks }) => {
  const queryClient = useQueryClient();
  const config = statusConfig[sprint.status];

  const sprintTasks = tasks?.filter(t => t.sprint === sprint._id) || [];
  const doneTasks = sprintTasks.filter(t => t.status === 'done').length;
  const progress = sprintTasks.length > 0 ? Math.round((doneTasks / sprintTasks.length) * 100) : 0;
  const isOverdue = isPast(new Date(sprint.endDate)) && sprint.status !== 'completed';

  const { mutate: startSprint, isPending: starting } = useMutation({
    mutationFn: () => startSprintAPI(sprint._id),
    onSuccess: () => {
      toast.success('Sprint started!');
      queryClient.invalidateQueries(['sprints', projectId]);
    }
  });

  const { mutate: completeSprint, isPending: completing } = useMutation({
    mutationFn: () => completeSprintAPI(sprint._id),
    onSuccess: () => {
      toast.success('Sprint completed! 🎉');
      queryClient.invalidateQueries(['sprints', projectId]);
    }
  });

  const { mutate: deleteSprint } = useMutation({
    mutationFn: () => deleteSprintAPI(sprint._id),
    onSuccess: () => {
      toast.success('Sprint deleted');
      queryClient.invalidateQueries(['sprints', projectId]);
    }
  });

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-lg">{sprint.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${config.bg} ${config.color} ${config.border}`}>
                {config.label}
              </span>
              {isOverdue && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  Overdue
                </span>
              )}
            </div>
            {sprint.goal && (
              <p className="text-gray-400 text-sm">{sprint.goal}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            {sprint.status === 'planning' && (
              <button
                onClick={() => startSprint()}
                disabled={starting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                {starting ? 'Starting...' : '▶ Start Sprint'}
              </button>
            )}
            {sprint.status === 'active' && (
              <button
                onClick={() => completeSprint()}
                disabled={completing}
                className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                {completing ? 'Completing...' : '✓ Complete Sprint'}
              </button>
            )}
            {sprint.status !== 'active' && (
              <button
                onClick={() => deleteSprint()}
                className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>📅 {format(new Date(sprint.startDate), 'MMM d')} → {format(new Date(sprint.endDate), 'MMM d, yyyy')}</span>
          {sprint.status === 'active' && (
            <span className={isOverdue ? 'text-red-400' : 'text-gray-400'}>
              {isOverdue ? '⚠️ Overdue by ' : '⏱️ '}
              {formatDistanceToNow(new Date(sprint.endDate))}
              {!isOverdue && ' remaining'}
            </span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Progress</span>
          <span className="text-white text-sm font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              progress === 100 ? 'bg-green-500' :
              progress > 50 ? 'bg-indigo-500' : 'bg-yellow-500'
            }`}
          />
        </div>

        {/* Task stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: sprintTasks.length, color: 'text-gray-300' },
            { label: 'Todo', value: sprintTasks.filter(t => t.status === 'todo').length, color: 'text-blue-400' },
            { label: 'In Progress', value: sprintTasks.filter(t => t.status === 'in_progress').length, color: 'text-indigo-400' },
            { label: 'Done', value: doneTasks, color: 'text-green-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-800/50 rounded-xl p-3 text-center">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SprintCard;