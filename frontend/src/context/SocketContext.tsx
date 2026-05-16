import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Manage real-time WebSocket connection with Firebase authentication
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (user) {
      const initSocket = async () => {
        const token = await user.getIdToken();
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
          auth: { token }
        });

        newSocket.on('connect', () => setConnected(true));
        newSocket.on('disconnect', () => setConnected(false));

        setSocket(newSocket);
      };

      initSocket();

      return () => {
        socket?.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
