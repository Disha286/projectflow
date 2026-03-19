import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

let socketInstance = null;

const useSocket = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !socketInstance) {
      socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      socketInstance.on('connect', () => {
        console.log('⚡ Socket connected:', socketInstance.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });
    }

    return () => {
      if (!isAuthenticated && socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
    };
  }, [isAuthenticated]);

  return socketInstance;
};

export const getSocket = () => socketInstance;

export default useSocket;