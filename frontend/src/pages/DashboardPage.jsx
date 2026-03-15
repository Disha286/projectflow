import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getMyTasksAPI } from '../api/tasks';
import { getWorkspacesAPI } from '../api/workspace';
import useAuthStore from '../store/authStore';
import StatsCard from '../components/dashboard/StatsCard';
import MyTasksList from '../components/dashboard/MyTasksList';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const DashboardPage = () => {
  const { user } = useAuthStore();

  const { data: tasksData } = useQuery({
    queryKey: ['myTasks'],
    queryFn: () => getMyTasksAPI().then(r => r.data)
  });

  const { data: workspacesData } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => getWorkspacesAPI().then(r => r.data)
  });

  const tasks = tasksData?.tasks || [];
  const workspaces = workspacesData?.workspaces || [];

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-1">
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your projects today.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatsCard title="Total Tasks" value={totalTasks} icon="📋" color="indigo" />
        <StatsCard title="In Progress" value={inProgressTasks} icon="⚡" color="yellow" />
        <StatsCard title="Completed" value={doneTasks} icon="✅" color="green" />
        <StatsCard title="Overdue" value={overdueTasks} icon="⚠️" color="red" />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-lg">My Tasks</h2>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
              {totalTasks} total
            </span>
          </div>
          <MyTasksList />
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Workspaces */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
          >
            <h2 className="text-white font-semibold text-lg mb-4">Workspaces</h2>
            {workspaces.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">🏢</div>
                <p className="text-gray-400 text-sm mb-3">No workspaces yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {workspaces.map((ws) => (
                  <div key={ws._id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {ws.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{ws.name}</div>
                      <div className="text-gray-500 text-xs">{ws.members?.length} members</div>
                    </div>
                    <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      {ws.plan}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
          >
            <h2 className="text-white font-semibold text-lg mb-4">Recent Activity</h2>
            <ActivityFeed />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;