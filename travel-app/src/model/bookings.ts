import mongoose, { Schema, Document, Types, Query, HydratedDocument } from 'mongoose';


export interface IBooking extends Document {
  tour: Types.ObjectId;
  user: Types.ObjectId;
  email: string;
  price: number;
  createdAt: Date;
  paid: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  transaction: {
    tx_ref: string;
    chapa_id?: string;
    payment_method?: 'chapa' | 'paypal' | 'stripe';
    payment_status: 'pending' | 'paid' | 'failed';
    payment_date?: Date;
  };
}

const bookingSchema = new Schema<IBooking>(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: [true, 'Booking must belong to a user'],
    },
    email: {
      type: String,
      required: [true, 'User must have an email'],
      // Removed unique: true to allow multiple bookings by same email
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    transaction: {
      tx_ref: {
        type: String,
        required: [true, 'Transaction reference is required'],
      },
      chapa_id: {
        type: String,
      },
      payment_method: {
        type: String,
        enum: ['chapa', 'paypal', 'stripe'],
        default: 'chapa',
      },
      payment_status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
      },
      payment_date: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate booking for same tour and email
bookingSchema.index({ tour: 1, email: 1 }, { unique: true });

// Auto-populate tour info on any find query
bookingSchema.pre(/^find/, function (
  this: Query<HydratedDocument<IBooking>[], HydratedDocument<IBooking>>,
  next
) {
  this.populate('tour');
  next();
});
// Auto-populate tour and user info on any find query



// Automatically set payment_date when payment_status changes to 'paid'
bookingSchema.pre('save', function (next) {
  if (
    this.isModified('transaction.payment_status') &&
    this.transaction.payment_status === 'paid' &&
    !this.transaction.payment_date
  ) {
    this.transaction.payment_date = new Date();
  }
  next();
});

const BookingModel =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default BookingModel;
