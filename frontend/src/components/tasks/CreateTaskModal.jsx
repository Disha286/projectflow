import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createTaskAPI } from '../../api/tasks';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

const priorities = ['urgent', 'high', 'medium', 'low'];
const statuses = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];

const CreateTaskModal = ({ isOpen, onClose, projectId, workspaceId, defaultStatus = 'todo' }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: defaultStatus,
    dueDate: ''
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => createTaskAPI(data),
    onSuccess: () => {
      toast.success('Task created!');
      queryClient.invalidateQueries(['tasks', projectId]);
      onClose();
      setForm({ title: '', description: '', priority: 'medium', status: defaultStatus, dueDate: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Task title is required');
    mutate({
      ...form,
      projectId,
      workspaceId,
      dueDate: form.dueDate || null
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create new task" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task title"
          placeholder="e.g. Design the login page"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            placeholder="Add more details..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Priority</label>
          <div className="grid grid-cols-4 gap-2">
            {priorities.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setForm({ ...form, priority: p })}
                className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  form.priority === p
                    ? p === 'urgent' ? 'bg-red-600 text-white'
                      : p === 'high' ? 'bg-orange-600 text-white'
                      : p === 'medium' ? 'bg-yellow-600 text-white'
                      : 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <Input
          label="Due date (optional)"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1" loading={isPending}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;