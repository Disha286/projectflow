import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getSprintsAPI } from '../api/sprints';
import { getProjectAPI } from '../api/projects';
import { getProjectTasksAPI } from '../api/tasks';
import SprintCard from '../components/sprints/SprintCard';
import CreateSprintModal from '../components/sprints/CreateSprintModal';
import Button from '../components/ui/Button';

const SprintPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const { data: projectData } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectAPI(projectId).then(r => r.data),
    enabled: !!projectId
  });

  const { data: sprintsData, isLoading } = useQuery({
    queryKey: ['sprints', projectId],
    queryFn: () => getSprintsAPI(projectId).then(r => r.data),
    enabled: !!projectId
  });

  const { data: tasksData } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getProjectTasksAPI(projectId).then(r => r.data),
    enabled: !!projectId
  });

  const project = projectData?.project;
  const sprints = sprintsData?.sprints || [];
  const tasks = tasksData?.tasks || [];

  const activeSprint = sprints.find(s => s.status === 'active');
  const planningSprints = sprints.filter(s => s.status === 'planning');
  const completedSprints = sprints.filter(s => s.status === 'completed');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{
            backgroundColor: project?.color + '20',
            border: `1px solid ${project?.color}40`
          }}
        >
          {project?.icon}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{project?.name} — Sprints</h1>
          <p className="text-gray-400 text-sm">{sprints.length} sprint{sprints.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Sprint
        </Button>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && sprints.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🏃</div>
          <h3 className="text-white font-semibold text-xl mb-2">No sprints yet</h3>
          <p className="text-gray-400 mb-6">Create your first sprint to start planning!</p>
          <Button variant="primary" size="lg" onClick={() => setShowCreate(true)}>
            Create first sprint
          </Button>
        </motion.div>
      )}

      {/* Active Sprint */}
      {activeSprint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-white font-semibold">Active Sprint</h2>
          </div>
          <SprintCard
            sprint={activeSprint}
            projectId={projectId}
            tasks={tasks}
          />
        </motion.div>
      )}

      {/* Planning Sprints */}
      {planningSprints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-white font-semibold mb-4">
            Planning
            <span className="ml-2 text-gray-500 font-normal text-sm">({planningSprints.length})</span>
          </h2>
          <div className="space-y-4">
            {planningSprints.map((sprint) => (
              <SprintCard
                key={sprint._id}
                sprint={sprint}
                projectId={projectId}
                tasks={tasks}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Completed Sprints */}
      {completedSprints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-white font-semibold mb-4">
            Completed
            <span className="ml-2 text-gray-500 font-normal text-sm">({completedSprints.length})</span>
          </h2>
          <div className="space-y-4 opacity-75">
            {completedSprints.map((sprint) => (
              <SprintCard
                key={sprint._id}
                sprint={sprint}
                projectId={projectId}
                tasks={tasks}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Create Sprint Modal */}
      <CreateSprintModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        projectId={projectId}
      />
    </div>
  );
};

export default SprintPage;