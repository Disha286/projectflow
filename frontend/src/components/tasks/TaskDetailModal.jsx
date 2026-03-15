import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getTaskAPI, updateTaskAPI, deleteTaskAPI } from '../../api/tasks';
import SubTaskList from './SubTaskList';
import CommentSection from './CommentSection';

const priorities = ['urgent', 'high', 'medium', 'low'];
const statuses = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];

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

const TaskDetailModal = ({ taskId, isOpen, onClose, projectId }) => {
  const queryClient = useQueryClient();
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState('subtasks');

  const { data, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskAPI(taskId).then(r => r.data),
    enabled: !!taskId && isOpen
  });

  const task = data?.task;

  useEffect(() => {
    if (task) setTitle(task.title);
  }, [task]);

  const { mutate: updateTask } = useMutation({
    mutationFn: (data) => updateTaskAPI(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId]);
      queryClient.invalidateQueries(['tasks', projectId]);
      toast.success('Task updated!');
    },
    onError: () => toast.error('Failed to update task')
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: () => deleteTaskAPI(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', projectId]);
      toast.success('Task deleted!');
      onClose();
    }
  });

  const handleTitleSave = () => {
    if (title.trim() && title !== task?.title) {
      updateTask({ title: title.trim() });
    }
    setEditingTitle(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : task ? (
              <>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-800 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {editingTitle ? (
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                        autoFocus
                        className="w-full text-xl font-bold text-white bg-gray-800 border border-indigo-500 rounded-lg px-3 py-1 focus:outline-none"
                      />
                    ) : (
                      <h2
                        onClick={() => setEditingTitle(true)}
                        className="text-xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        {task.title}
                      </h2>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteTask()}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Left - Main content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Description */}
                    <div>
                      <h4 className="text-white font-medium text-sm mb-2">Description</h4>
                      <textarea
                        defaultValue={task.description}
                        onBlur={(e) => {
                          if (e.target.value !== task.description) {
                            updateTask({ description: e.target.value });
                          }
                        }}
                        placeholder="Add a description..."
                        rows={4}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    {/* Tabs */}
                    <div>
                      <div className="flex gap-1 mb-4 bg-gray-800 rounded-lg p-1 w-fit">
                        {['subtasks', 'comments'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                              activeTab === tab
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {tab}
                            {tab === 'comments' && task.comments?.length > 0 && (
                              <span className="ml-1.5 text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                                {task.comments.length}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {activeTab === 'subtasks' && <SubTaskList task={task} />}
                      {activeTab === 'comments' && <CommentSection task={task} />}
                    </div>
                  </div>

                  {/* Right - Details sidebar */}
                  <div className="w-64 border-l border-gray-800 p-4 space-y-5 overflow-y-auto">
                    {/* Status */}
                    <div>
                      <label className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2 block">Status</label>
                      <select
                        value={task.status}
                        onChange={(e) => updateTask({ status: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2 block">Priority</label>
                      <div className="space-y-1">
                        {priorities.map((p) => (
                          <button
                            key={p}
                            onClick={() => updateTask({ priority: p })}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                              task.priority === p
                                ? priorityColors[p] + ' border'
                                : 'text-gray-400 hover:bg-gray-800'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${
                              p === 'urgent' ? 'bg-red-400' :
                              p === 'high' ? 'bg-orange-400' :
                              p === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                            }`} />
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2 block">Due Date</label>
                      <input
                        type="date"
                        defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateTask({ dueDate: e.target.value || null })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Created */}
                    <div>
                      <label className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2 block">Created</label>
                      <p className="text-gray-300 text-sm">
                        {new Date(task.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Assignees */}
                    <div>
                      <label className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2 block">Assignees</label>
                      {task.assignees?.length === 0 ? (
                        <p className="text-gray-500 text-sm">No assignees</p>
                      ) : (
                        <div className="space-y-2">
                          {task.assignees?.map((a) => (
                            <div key={a._id} className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {a.name?.[0]}
                              </div>
                              <span className="text-gray-300 text-sm">{a.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailModal;