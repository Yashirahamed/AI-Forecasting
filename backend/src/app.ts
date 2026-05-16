import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocket } from './config/socket';
import { errorHandler } from './middleware/error.middleware';

// Routes imports
import authRoutes from './routes/auth.routes';
// ... other routes will be imported as developed

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
export const io = initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('WeatherCast AI API (Firebase Version) is running...');
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
