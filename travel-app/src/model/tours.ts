import { create } from 'domain';
import mongoose, { Schema, Document } from 'mongoose';

// TypeScript Interface
export interface ITour extends Document {
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[];
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  coverImage: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    description: string;
  };
  startDates: Date[];
  endDate: Date;
  likes: mongoose.Types.ObjectId[]; // ✅ updated here
  comments: {
    message: string;
    userId: mongoose.Types.ObjectId;
    userImage: string;
  }[];
  createdAt: Date;
  guides: mongoose.Types.ObjectId[];
}

// ✅ Comment schema
const commentSchema = new Schema(
  {
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userImage: { type: String },
    name: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ✅ Tour schema
const tourSchema = new Schema<ITour>({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must be less than or equal to 40 characters'],
    minlength: [5, 'A tour name must be more than or equal to 5 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  region: {
    type: String,
    required: [true, 'A tour must have a region'],
    trim: true,
  },
  typeOfTour: {
    type: [String],
    required: [true, 'Please specify at least one type of tour'],
    // no enum here, so any string allowed
  }
  ,
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maximum group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: ['easy', 'medium', 'difficult'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val: number) => Math.round(val * 10) / 10,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    default: [],
  },
  coverImage: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      required: [true, 'Location coordinates required'],
    },
    address: String,
    description: String,
  },
  startDates: [Date],
  endDate: {
    type: Date,
    required: [true, 'A tour must have an end date'],
  },

  // ✅ Updated likes
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  guides: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});
tourSchema.virtual('status').get(function (this: ITour) {
  const now = new Date();

  const hasFutureStart = this.startDates.some(date => date > now);
  const hasPastStart = this.startDates.some(date => date <= now);
  const isAfterEnd = this.endDate && now > this.endDate;

  if (isAfterEnd) return 'finished';
  if (hasPastStart && !isAfterEnd) return 'active';
  if (hasFutureStart) return 'pending';

  return 'unknown';
});

tourSchema.set('toObject', { virtuals: true });
tourSchema.set('toJSON', { virtuals: true });


// ✅ Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
tourSchema.index({ location: '2dsphere' });

// ✅ Final model
const TourModel = mongoose.models.Tour || mongoose.model<ITour>('Tour', tourSchema);

export default TourModel;
