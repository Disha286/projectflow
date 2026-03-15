import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createProjectAPI } from '../../api/projects';
import useWorkspaceStore from '../../store/workspaceStore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

const colors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'
];

const icons = ['📁', '🚀', '💡', '🎯', '🛠️', '📊', '🎨', '⚡'];

const projectTypes = ['software', 'marketing', 'design', 'general'];

const CreateProjectModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();
  const [form, setForm] = useState({
    name: '',
    description: '',
    color: '#6366f1',
    icon: '📁',
    type: 'general',
    visibility: 'public'
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => createProjectAPI(data),
    onSuccess: () => {
      toast.success('Project created!');
      queryClient.invalidateQueries(['projects']);
      onClose();
      setForm({ name: '', description: '', color: '#6366f1', icon: '📁', type: 'general', visibility: 'public' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Project name is required');
    if (!currentWorkspace) return toast.error('Please select a workspace first');
    mutate({ ...form, workspaceId: currentWorkspace._id });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create new project" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <Input
          label="Project name"
          placeholder="e.g. Website Redesign"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Description (optional)
          </label>
          <textarea
            placeholder="What is this project about?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Icon</label>
          <div className="flex gap-2 flex-wrap">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setForm({ ...form, icon })}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                  form.icon === icon
                    ? 'bg-indigo-600/30 border-2 border-indigo-500'
                    : 'bg-gray-800 border-2 border-transparent hover:border-gray-600'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Color</label>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, color })}
                className={`w-8 h-8 rounded-full transition-all ${
                  form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Project type</label>
          <div className="grid grid-cols-4 gap-2">
            {projectTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, type })}
                className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  form.type === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Visibility</label>
          <div className="grid grid-cols-2 gap-2">
            {['public', 'private'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setForm({ ...form, visibility: v })}
                className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all flex items-center gap-2 justify-center ${
                  form.visibility === v
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {v === 'public' ? '🌐' : '🔒'} {v}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-3">Preview</p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: form.color + '20', border: `1px solid ${form.color}40` }}
            >
              {form.icon}
            </div>
            <div>
              <div className="text-white font-medium">{form.name || 'Project name'}</div>
              <div className="text-gray-400 text-xs capitalize">{form.type} · {form.visibility}</div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1" loading={isPending}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;