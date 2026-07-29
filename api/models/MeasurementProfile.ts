import mongoose, { Schema, Document } from 'mongoose';

export interface IMeasurementProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  measurementType: 'shirt' | 'pant' | 'combined';
  unit: 'in' | 'cm';
  isDefault: boolean;
  measurements: Record<string, number>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const measurementProfileSchema = new Schema<IMeasurementProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    measurementType: {
      type: String,
      enum: ['shirt', 'pant', 'combined'],
      required: true,
      default: 'shirt',
    },
    unit: {
      type: String,
      enum: ['in', 'cm'],
      required: true,
      default: 'in',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    measurements: {
      type: Map,
      of: Number,
      default: {},
    },
    notes: String,
  },
  { timestamps: true }
);

measurementProfileSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model<IMeasurementProfile>('MeasurementProfile', measurementProfileSchema);