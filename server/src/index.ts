import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './Routes/authRoutes';
import menuRoutes from './Routes/menuRoutes';
import orderRoutes from './Routes/orderRoutes';
import debugRoutes from './Routes/debugRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Restaurant Ordering Platform API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Debug routes (development only)
if (process.env.NODE_ENV === 'development') {
  app.use('/api/debug', debugRoutes);
  console.log('🛠️  Debug routes enabled at /api/debug');
}

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
