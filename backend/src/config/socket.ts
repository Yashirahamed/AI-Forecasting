import { Server } from 'socket.io';
import http from 'http';
import { adminAuth } from './firebase';

// Socket.io setup with Firebase token verification for secure real-time communication
export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Socket middleware for token verification
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: No token provided'));

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      (socket as any).user = decodedToken;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected via socket:', socket.id);

    socket.on('join-room', (room) => {
      socket.join(room);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};
