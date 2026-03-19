import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getProjectAPI } from '../api/projects';
import { getProjectTasksAPI } from '../api/tasks';
import useWorkspaceStore from '../store/workspaceStore';
import KanbanBoard from '../components/tasks/KanbanBoard';
import ListView from '../components/tasks/ListView';
import FilterBar from '../components/tasks/FilterBar';
import TaskDetailModal from '../components/tasks/TaskDetailModal';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import Button from '../components/ui/Button';
import useProjectSocket from '../hooks/useProjectSocket';

const views = [
  {
    id: 'board',
    label: 'Board',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    )
  },
  {
    id: 'list',
    label: 'List',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )
  }
];

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceStore();
  const [activeView, setActiveView] = useState('board');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    status: '',
    dueDate: ''
  });

  useProjectSocket(projectId, currentWorkspace?._id);

  const { data: projectData } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectAPI(projectId).then(r => r.data),
    enabled: !!projectId
  });

  const { data: tasksData } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getProjectTasksAPI(projectId).then(r => r.data),
    enabled: !!projectId
  });

  const project = projectData?.project;
  const allTasks = tasksData?.tasks || [];

  // Apply filters
  const filteredTasks = allTasks.filter(task => {
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.dueDate === 'overdue' && (!task.dueDate || new Date(task.dueDate) >= new Date())) return false;
    if (filters.dueDate === 'today') {
      const today = new Date().toDateString();
      if (!task.dueDate || new Date(task.dueDate).toDateString() !== today) return false;
    }
    if (filters.dueDate === 'week') {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      if (!task.dueDate || new Date(task.dueDate) > weekFromNow) return false;
    }
    return true;
  });

  const clearFilters = () => setFilters({ search: '', priority: '', status: '', dueDate: '' });

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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/projects/${projectId}/sprints`)}
          >
          🏃 Sprints
        </Button>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{
            backgroundColor: project?.color + '20',
            border: `1px solid ${project?.color}40`
          }}
        >
          {project?.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{project?.name}</h1>
          <p className="text-gray-400 text-sm">{allTasks.length} tasks</p>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeView === view.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {view.icon}
              {view.label}
            </button>
          ))}
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </Button>
      </motion.div>

      {/* Filter Bar - only show in list view */}
      {activeView === 'list' && (
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onClear={clearFilters}
        />
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeView === 'board' && (
          <KanbanBoard
            projectId={projectId}
            workspaceId={currentWorkspace?._id}
            onEditTask={(task) => setSelectedTaskId(task._id)}
          />
        )}

        {activeView === 'list' && (
          <ListView
            tasks={filteredTasks}
            projectId={projectId}
            onEditTask={(task) => setSelectedTaskId(task._id)}
          />
        )}
      </div>

      {/* Modals */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        projectId={projectId}
      />

      <CreateTaskModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        projectId={projectId}
        workspaceId={currentWorkspace?._id}
        defaultStatus="todo"
      />
    </div>
  );
};


export default ProjectPage;