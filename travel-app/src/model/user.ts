import mongoose, { Schema, models, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define a custom interface for your user schema
interface IUser extends Document {
  name?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  email: string;
  role: string;
  password: string;
  image?: string;
  createdAt: Date;
  location?: string;
  phoneNumber?: string;
  available:boolean
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    [key: string]: string | undefined; // for flexibility
  };
}

// Define the schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  resetPasswordToken: String,
resetPasswordExpire: Date,

  socialMedia: {
    type: Map,
    of: String,
    default: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean, // Capital B — this is the JavaScript Boolean constructor
    default: true
  }
  
});

// 🔐 Pre-save middleware to hash password
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password!, salt);

  next();
});

// Prevent re-compilation
const UserModel = models.UserModel || model<IUser>('UserModel', userSchema);
export default UserModel;
