import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSubTaskAPI, updateSubTaskAPI, deleteSubTaskAPI } from '../../api/tasks';

const SubTaskList = ({ task }) => {
  const queryClient = useQueryClient();
  const [newSubTask, setNewSubTask] = useState('');
  const [adding, setAdding] = useState(false);

  const { mutate: addSubTask } = useMutation({
    mutationFn: (data) => addSubTaskAPI(task._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', task._id]);
      queryClient.invalidateQueries(['tasks', task.project]);
      setNewSubTask('');
      setAdding(false);
    }
  });

  const { mutate: updateSubTask } = useMutation({
    mutationFn: ({ subTaskId, data }) => updateSubTaskAPI(task._id, subTaskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', task._id]);
      queryClient.invalidateQueries(['tasks', task.project]);
    }
  });

  const { mutate: deleteSubTask } = useMutation({
    mutationFn: (subTaskId) => deleteSubTaskAPI(task._id, subTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', task._id]);
    }
  });

  const completedCount = task.subTasks?.filter(s => s.isCompleted).length || 0;
  const totalCount = task.subTasks?.length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium text-sm">
          Subtasks
          {totalCount > 0 && (
            <span className="ml-2 text-gray-400 font-normal">
              {completedCount}/{totalCount}
            </span>
          )}
        </h4>
        <button
          onClick={() => setAdding(true)}
          className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
        >
          + Add subtask
        </button>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {/* Subtask list */}
      <div className="space-y-2">
        {task.subTasks?.map((subTask) => (
          <div key={subTask._id} className="flex items-center gap-3 group">
            <button
              onClick={() => updateSubTask({
                subTaskId: subTask._id,
                data: { isCompleted: !subTask.isCompleted }
              })}
              className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                subTask.isCompleted
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-gray-600 hover:border-indigo-500'
              }`}
            >
              {subTask.isCompleted && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm ${subTask.isCompleted ? 'line-through text-gray-500' : 'text-gray-300'}`}>
              {subTask.title}
            </span>
            <button
              onClick={() => deleteSubTask(subTask._id)}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add subtask input */}
      {adding && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            placeholder="Subtask title..."
            value={newSubTask}
            onChange={(e) => setNewSubTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newSubTask.trim()) {
                addSubTask({ title: newSubTask.trim() });
              }
              if (e.key === 'Escape') setAdding(false);
            }}
            autoFocus
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => newSubTask.trim() && addSubTask({ title: newSubTask.trim() })}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Add
          </button>
          <button
            onClick={() => setAdding(false)}
            className="text-gray-500 hover:text-white text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default SubTaskList;