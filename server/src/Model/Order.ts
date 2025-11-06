import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  items: IOrderItem[];
  customerName: string;
  contactInfo: {
    phone: string;
    email?: string;
  };
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Served' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  menuItem: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    items: [orderItemSchema],
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    contactInfo: {
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Served', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const timestamp = date.getTime();
    this.orderNumber = `ORD-${timestamp}`;
  }
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);
