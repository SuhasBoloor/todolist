import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (userId) => {
  const socket = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Connect to backend
    socket.current = io(SOCKET_URL);

    socket.current.on('connect', () => {
      console.log('Connected to socket server');
      // Join a room specifically for this user
      socket.current.emit('join-room', userId);
    });

    // Handle reminders
    socket.current.on('reminder', (data) => {
      console.log('Received reminder:', data);
      setNotifications((prev) => [...prev, { ...data, id: Date.now() }]);
      
      // Auto-remove notification after 10 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== data.id));
      }, 10000);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId]);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, removeNotification };
};
