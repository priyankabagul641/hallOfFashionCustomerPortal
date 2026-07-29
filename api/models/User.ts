import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  addresses: Array<{
    type: 'home' | 'office';
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
  }>;
  measurements?: {
    height?: string;
    bust?: string;
    waist?: string;
    hips?: string;
  };
  preferredMeasurementUnit?: 'in' | 'cm';
  measurementProfileIds?: mongoose.Schema.Types.ObjectId[];
  preferences?: {
    favoriteDesigners: string[];
    favoriteCategories: string[];
  };
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: String,
    addresses: [
      {
        type: { type: String, enum: ['home', 'office'], default: 'home' },
        street: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    measurements: {
      height: String,
      bust: String,
      waist: String,
      hips: String,
    },
    preferredMeasurementUnit: {
      type: String,
      enum: ['in', 'cm'],
      default: 'in',
    },
    measurementProfileIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MeasurementProfile',
      },
    ],
    preferences: {
      favoriteDesigners: [String],
      favoriteCategories: [String],
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
