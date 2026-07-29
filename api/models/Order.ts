import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  orderNumber: string;
  items: Array<{
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    size: string;
    customization?: string;
    measurementProfileId?: mongoose.Schema.Types.ObjectId;
    measurementProfileName?: string;
    measurementType?: 'shirt' | 'pant' | 'combined';
    measurementUnit?: 'in' | 'cm';
    measurementSnapshot?: Record<string, number>;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  billingAddress?: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  giftWrapping: boolean;
  giftMessage?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        customization: String,
        measurementProfileId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MeasurementProfile',
        },
        measurementProfileName: String,
        measurementType: {
          type: String,
          enum: ['shirt', 'pant', 'combined'],
        },
        measurementUnit: {
          type: String,
          enum: ['in', 'cm'],
        },
        measurementSnapshot: {
          type: Map,
          of: Number,
        },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    billingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'processing',
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    giftWrapping: {
      type: Boolean,
      default: false,
    },
    giftMessage: String,
    notes: String,
  },
  { timestamps: true }
);

// Index for user orders
orderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IOrder>('Order', orderSchema);
