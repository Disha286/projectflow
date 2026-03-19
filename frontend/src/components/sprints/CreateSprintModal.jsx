import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createSprintAPI } from '../../api/sprints';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CreateSprintModal = ({ isOpen, onClose, projectId }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: ''
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => createSprintAPI(projectId, data),
    onSuccess: () => {
      toast.success('Sprint created!');
      queryClient.invalidateQueries(['sprints', projectId]);
      onClose();
      setForm({ name: '', goal: '', startDate: '', endDate: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create sprint');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Sprint name is required');
    if (!form.startDate || !form.endDate) return toast.error('Start and end dates are required');
    mutate(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create new sprint" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Sprint name"
          placeholder="e.g. Sprint 1"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Sprint goal (optional)
          </label>
          <textarea
            placeholder="What do you want to achieve in this sprint?"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
            rows={3}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start date"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
          <Input
            label="End date"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>

        {/* Duration preview */}
        {form.startDate && form.endDate && (
          <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
            ⏱️ Duration: {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} days
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1" loading={isPending}>
            Create Sprint
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSprintModal;