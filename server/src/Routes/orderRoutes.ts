import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByOrderNumber,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
} from '../Controller/orderController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/', createOrder);
router.get('/tracking/:orderNumber', getOrderByOrderNumber);

// Admin-only routes
router.get('/', authenticate, isAdmin, getAllOrders);
router.get('/stats', authenticate, isAdmin, getOrderStats);
router.get('/:id', authenticate, isAdmin, getOrderById);
router.put('/:id/status', authenticate, isAdmin, updateOrderStatus);
router.delete('/:id', authenticate, isAdmin, deleteOrder);

export default router;
