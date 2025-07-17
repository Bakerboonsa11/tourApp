import mongoose, { Schema, models, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define a custom interface for your user schema
interface IUser extends Document {
  name?: string;
  email: string;
  role: string;
  password: string;
  image?: string;
  createdAt: Date;
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
    required:true,
    minlength: 6,
  },
 
  image: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
