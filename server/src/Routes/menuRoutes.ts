import express from 'express';
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
} from '../Controller/menuController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

// Admin-only routes
router.post('/', authenticate, isAdmin, createMenuItem);
router.put('/:id', authenticate, isAdmin, updateMenuItem);
router.delete('/:id', authenticate, isAdmin, deleteMenuItem);

export default router;
