import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getProjectAPI } from '../api/projects';
import useWorkspaceStore from '../store/workspaceStore';
import KanbanBoard from '../components/tasks/KanbanBoard';
import Button from '../components/ui/Button';

const KanbanPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceStore();

  const { data, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectAPI(projectId).then(r => r.data),
    enabled: !!projectId
  });

  const project = data?.project;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <button
          onClick={() => navigate('/projects')}
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
          <h1 className="text-2xl font-bold text-white">{project?.name}</h1>
          <p className="text-gray-400 text-sm">{project?.description || 'No description'}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </Button>
        </div>
      </motion.div>

      {/* Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          projectId={projectId}
          workspaceId={currentWorkspace?._id}
        />
      </div>
    </div>
  );
};

export default KanbanPage;