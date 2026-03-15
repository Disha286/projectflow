import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

const columnConfig = {
  backlog: { label: 'Backlog', color: 'bg-gray-500', light: 'text-gray-400' },
  todo: { label: 'Todo', color: 'bg-blue-500', light: 'text-blue-400' },
  in_progress: { label: 'In Progress', color: 'bg-indigo-500', light: 'text-indigo-400' },
  in_review: { label: 'In Review', color: 'bg-purple-500', light: 'text-purple-400' },
  done: { label: 'Done', color: 'bg-green-500', light: 'text-green-400' },
};

const SortableTaskCard = ({ task, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} isDragging={isDragging} />
    </div>
  );
};

const KanbanColumn = ({ status, tasks, onAddTask, onEditTask }) => {
  const config = columnConfig[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex-shrink-0 w-72">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
          <span className="text-white font-medium text-sm">{config.label}</span>
          <span className="text-gray-500 text-xs bg-gray-800 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={`min-h-96 rounded-xl p-2 transition-all ${
          isOver ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-gray-900/50'
        }`}
      >
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map((task) => (
              <SortableTaskCard key={task._id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div
            className="h-24 flex items-center justify-center cursor-pointer rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 transition-colors"
            onClick={() => onAddTask(status)}
          >
            <span className="text-gray-600 text-sm">+ Add task</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;