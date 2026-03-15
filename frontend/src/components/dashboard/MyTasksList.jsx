import { useQuery } from '@tanstack/react-query';
import { getMyTasksAPI } from '../../api/tasks';
import { format } from 'date-fns';

const priorityColors = {
  urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const statusColors = {
  backlog: 'bg-gray-500/10 text-gray-400',
  todo: 'bg-blue-500/10 text-blue-400',
  in_progress: 'bg-indigo-500/10 text-indigo-400',
  in_review: 'bg-purple-500/10 text-purple-400',
  done: 'bg-green-500/10 text-green-400',
};

const MyTasksList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['myTasks'],
    queryFn: () => getMyTasksAPI().then(r => r.data)
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const tasks = data?.tasks || [];

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-3">✅</div>
        <p className="text-gray-400 text-sm">No tasks assigned to you yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.slice(0, 6).map((task) => (
        <div
          key={task._id}
          className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-gray-700"
        >
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            task.priority === 'urgent' ? 'bg-red-400' :
            task.priority === 'high' ? 'bg-orange-400' :
            task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
          }`} />
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{task.title}</div>
            <div className="text-gray-500 text-xs truncate">{task.project?.name}</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-500">
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTasksList;