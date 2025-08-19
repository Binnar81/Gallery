import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  title: string;
  description?: string;
  url: string;
  publicId: string;
  format: string;
  size: number;
  width: number;
  height: number;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  publicId: {
    type: String,
    required: [true, 'Public ID is required']
  },
  format: {
    type: String,
    required: [true, 'Image format is required']
  },
  size: {
    type: Number,
    required: [true, 'Image size is required']
  },
  width: {
    type: Number,
    required: [true, 'Image width is required']
  },
  height: {
    type: Number,
    required: [true, 'Image height is required']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  }
}, {
  timestamps: true
});

// Index for faster queries
imageSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<IImage>('Image', imageSchema); 