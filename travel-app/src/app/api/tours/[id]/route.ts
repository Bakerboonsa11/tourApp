import { NextRequest } from 'next/server';
import {connectDB }from '../../../../lib/db';
import TourModel from '@/model/tours';
import { getOne,createOne } from '../../../../lib/factoryfun';

export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
  await connectDB();
  return getOne(TourModel)(req, context);
};


export const POST = async (req: NextRequest) => {
  await connectDB();
  return createOne(TourModel)(req);
};
