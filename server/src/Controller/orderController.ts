import { Request, Response, NextFunction } from 'express';
import Order from '../Model/Order';
import MenuItem from '../Model/Menu';
import { AppError } from '../middleware/errorHandler';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { items, customerName, contactInfo, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }

    if (!customerName || !contactInfo?.phone) {
      throw new AppError('Customer name and phone number are required', 400);
    }

    // Validate menu items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      
      if (!menuItem) {
        throw new AppError(`Menu item ${item.menuItem} not found`, 404);
      }

      if (!menuItem.availability) {
        throw new AppError(`${menuItem.name} is currently unavailable`, 400);
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      items: orderItems,
      customerName,
      contactInfo,
      totalAmount,
      notes,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.query;
    
    const filter: any = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByOrderNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.menuItem');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status) {
      throw new AppError('Status is required', 400);
    }

    const validStatuses = ['Pending', 'Preparing', 'Served', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.menuItem');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const preparingOrders = await Order.countDocuments({ status: 'Preparing' });
    const servedOrders = await Order.countDocuments({ status: 'Served' });
    const completedOrders = await Order.countDocuments({ status: 'Completed' });

    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['Completed', 'Served'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        preparingOrders,
        servedOrders,
        completedOrders,
        revenue: revenue.length > 0 ? revenue[0].total : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
