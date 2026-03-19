import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getSocket } from './useSocket';

const useProjectSocket = (projectId, workspaceId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !projectId) return;

    // Join rooms
    socket.emit('join:project', projectId);
    if (workspaceId) socket.emit('join:workspace', workspaceId);

    // Listen for task updates
    socket.on('task:updated', ({ taskId, updates, updatedBy }) => {
      queryClient.invalidateQueries(['tasks', projectId]);
      queryClient.invalidateQueries(['task', taskId]);
      toast(`${updatedBy} updated a task`, {
        icon: '⚡',
        style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' }
      });
    });

    // Listen for task created
    socket.on('task:created', ({ task, createdBy }) => {
      queryClient.invalidateQueries(['tasks', projectId]);
      toast(`${createdBy} created a new task`, {
        icon: '✅',
        style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' }
      });
    });

    // Listen for comments
    socket.on('comment:added', ({ taskId, addedBy }) => {
      queryClient.invalidateQueries(['task', taskId]);
      toast(`${addedBy} commented on a task`, {
        icon: '💬',
        style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' }
      });
    });

    return () => {
      socket.emit('leave:project', projectId);
      socket.off('task:updated');
      socket.off('task:created');
      socket.off('comment:added');
    };
  }, [projectId, workspaceId, queryClient]);
};

export default useProjectSocket;