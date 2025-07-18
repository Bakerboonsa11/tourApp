import { NextRequest } from 'next/server';
import {connectDB }from './../../../lib/db';
import TourModel from '@/model/tours';
import { createOne, getAll,createMany } from '../../../lib/factoryfun';

export const GET = async (req: NextRequest) => {
  await connectDB();
  return getAll(TourModel)(req);
};

export const POST = async (req: NextRequest) => {
  await connectDB();
  return createMany(TourModel)(req);
};
