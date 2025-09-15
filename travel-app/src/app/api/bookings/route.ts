import { NextRequest } from 'next/server';
import {connectDB }from '../../../lib/db';
import BookingModel from '@/model/bookings';
import { getAll,createMany } from '../../../lib/factoryfun';

export const GET = async (req: NextRequest) => {
  await connectDB();
  return getAll(BookingModel)(req);
};

export const POST = async (req: NextRequest) => {
  await connectDB();
  return createMany(BookingModel)(req);
};
