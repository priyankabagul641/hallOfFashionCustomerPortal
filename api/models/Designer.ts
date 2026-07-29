import mongoose, { Schema, Document } from 'mongoose';

export interface IDesigner extends Document {
  name: string;
  slug: string;
  image: string;
  banner: string;
  description: string;
  story: string;
  specializations: string[];
  awards: string[];
  yearsActive: number;
  teamSize: number;
  baseLocation: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  productCount: number;
  rating: number;
  followers: number;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const designerSchema = new Schema<IDesigner>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    specializations: [String],
    awards: [String],
    yearsActive: {
      type: Number,
      default: 0,
    },
    teamSize: {
      type: Number,
      default: 0,
    },
    baseLocation: {
      type: String,
      required: true,
    },
    website: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    followers: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDesigner>('Designer', designerSchema);
