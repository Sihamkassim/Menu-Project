import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  category: string;
  description?: string;
  image: string;
  price: number;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads', 'Soups'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
