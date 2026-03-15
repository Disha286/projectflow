import { motion } from 'framer-motion';

const priorityConfig = {
  urgent: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-400' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
  low: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-400' },
};

const TaskCard = ({ task, onEdit, isDragging }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      onClick={() => onEdit && onEdit(task)}
      className={`bg-gray-800 rounded-xl p-4 border cursor-pointer transition-all group ${
        isDragging
          ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 rotate-2'
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      {/* Priority + Labels */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${priority.bg} ${priority.color} ${priority.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {task.priority}
        </span>
        {task.labels?.slice(0, 2).map((label) => (
          <span
            key={label._id}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: label.color + '20', color: label.color }}
          >
            {label.name}
          </span>
        ))}
      </div>

      {/* Title */}
      <h4 className="text-white text-sm font-medium mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Subtasks progress */}
      {task.subTasks?.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Subtasks</span>
            <span>{task.subTasks.filter(s => s.isCompleted).length}/{task.subTasks.length}</span>
          </div>
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${(task.subTasks.filter(s => s.isCompleted).length / task.subTasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        {/* Assignees */}
        <div className="flex -space-x-1.5">
          {task.assignees?.slice(0, 3).map((assignee, i) => (
            <div
              key={i}
              className="w-6 h-6 bg-indigo-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold"
              title={assignee.name}
            >
              {assignee.name?.[0] || 'U'}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 text-gray-500">
          {/* Comments count */}
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {task.comments.length}
            </span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <span className={`text-xs ${new Date(task.dueDate) < new Date() ? 'text-red-400' : 'text-gray-500'}`}>
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;