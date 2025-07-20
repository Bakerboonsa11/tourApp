import mongoose, { Schema, Document, Types, Query ,HydratedDocument} from 'mongoose';

export interface IBooking extends Document {
  tour: Types.ObjectId;
  email: string;
  price: number;
  createdAt: Date;
  paid: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  transaction: {
    tx_ref: string;
    chapa_id?: string;
    payment_method?: string;
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
    email: {
        type: String,
        required: [true, 'User must have an email'],
        unique: true,
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
        enum: ['pending', 'paid', 'failed'], // ✅ define valid statuses
        default: 'pending',
      },
      payment_date: {
        type: Date,
      },
    }
    
  },
  {
    timestamps: true,
  }
);

// Auto-populate tour and user info when fetching bookings
bookingSchema.pre(/^find/, function (next) {
    const query = this as Query<HydratedDocument<IBooking>[], HydratedDocument<IBooking>>;
    query.populate('tour');
    next();
  });

const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default BookingModel;
