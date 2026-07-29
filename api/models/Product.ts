import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discount?: number;
  finalPrice: number;
  images: string[];
  designerId: mongoose.Schema.Types.ObjectId;
  category: 'ethnic' | 'designer' | 'couture' | 'fusion';
  subcategory: string;
  occasion: string[];
  fabric: string;
  color: string;
  size: string[];
  stock: number;
  rating: number;
  reviews: number;
  isFeatured: boolean;
  isLimitedEdition: boolean;
  craftmanshipStory: string;
  care: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    designerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designer',
      required: true,
    },
    category: {
      type: String,
      enum: ['ethnic', 'designer', 'couture', 'fusion'],
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    occasion: [String],
    fabric: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    size: [String],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isLimitedEdition: {
      type: Boolean,
      default: false,
    },
    craftmanshipStory: String,
    care: [String],
  },
  { timestamps: true }
);

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ designerId: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
