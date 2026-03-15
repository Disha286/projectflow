import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';
import { getProjectTasksAPI, updateTaskStatusAPI } from '../../api/tasks';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

const STATUSES = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];

const KanbanBoard = ({ projectId, workspaceId }) => {
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getProjectTasksAPI(projectId).then(r => r.data),
    enabled: !!projectId
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ taskId, status }) => updateTaskStatusAPI(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', projectId]);
    },
    onError: () => toast.error('Failed to update task status')
  });

  const tasks = data?.tasks || [];

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  const handleDragStart = (event) => {
    const task = tasks.find(t => t._id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = STATUSES.includes(over.id) ? over.id : null;

    if (!newStatus) {
      const overTask = tasks.find(t => t._id === over.id);
      if (overTask && overTask.status !== tasks.find(t => t._id === taskId)?.status) {
        updateStatus({ taskId, status: overTask.status });
      }
      return;
    }

    const task = tasks.find(t => t._id === taskId);
    if (task && task.status !== newStatus) {
      updateStatus({ taskId, status: newStatus });
    }
  };

  const handleAddTask = (status) => {
    setDefaultStatus(status);
    setShowCreate(true);
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((s) => (
          <div key={s} className="flex-shrink-0 w-72 h-96 bg-gray-900/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              onAddTask={handleAddTask}
              onEditTask={(task) => console.log('edit', task)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        projectId={projectId}
        workspaceId={workspaceId}
        defaultStatus={defaultStatus}
      />
    </>
  );
};

export default KanbanBoard;