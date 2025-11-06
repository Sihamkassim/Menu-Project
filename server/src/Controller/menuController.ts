import { Request, Response, NextFunction } from 'express';
import MenuItem from '../Model/Menu';
import { AppError } from '../middleware/errorHandler';

export const getAllMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, availability } = req.query;
    
    const filter: any = {};
    if (category) filter.category = category;
    if (availability !== undefined) filter.availability = availability === 'true';

    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      throw new AppError('Menu item not found', 404);
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, category, description, image, price, availability } = req.body;

    if (!name || !category || !image || price === undefined) {
      throw new AppError('Name, category, image, and price are required', 400);
    }

    const menuItem = await MenuItem.create({
      name,
      category,
      description,
      image,
      price,
      availability: availability !== undefined ? availability : true,
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, category, description, image, price, availability } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      throw new AppError('Menu item not found', 404);
    }

    if (name) menuItem.name = name;
    if (category) menuItem.category = category;
    if (description !== undefined) menuItem.description = description;
    if (image) menuItem.image = image;
    if (price !== undefined) menuItem.price = price;
    if (availability !== undefined) menuItem.availability = availability;

    await menuItem.save();

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      throw new AppError('Menu item not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await MenuItem.distinct('category');

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
