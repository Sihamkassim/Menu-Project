import express from 'express';
import User from '../Model/User';
import MenuItem from '../Model/Menu';
import Order from '../Model/Order';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Check database status
router.get('/status', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const menuCount = await MenuItem.countDocuments();
    const orderCount = await Order.countDocuments();

    res.json({
      success: true,
      data: {
        users: userCount,
        menuItems: menuCount,
        orders: orderCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking status' });
  }
});

// Create admin user (development only)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email || 'admin@restaurant.com' });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password || 'admin123', 10);
    
    const admin = await User.create({
      username: 'admin',
      email: email || 'admin@restaurant.com',
      password: hashedPassword,
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        email: admin.email,
        password: password || 'admin123', // Return password for testing (dev only!)
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating admin',
      error: (error as Error).message,
    });
  }
});

// Test password verification
router.post('/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    res.json({
      success: true,
      data: {
        userFound: true,
        passwordMatch: isMatch,
        userEmail: user.email,
        hashedPassword: user.password.substring(0, 20) + '...',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing login',
      error: (error as Error).message,
    });
  }
});

export default router;
