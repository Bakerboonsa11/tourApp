import { NextRequest } from 'next/server';
import {connectDB }from '../../../../lib/db';
import TourModel from '@/model/tours';
import { getOne,createOne,updateOne } from '../../../../lib/factoryfun';

export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
  await connectDB();
  return getOne(TourModel, req, context); // ✅ no function call chaining
};



export const POST = async (req: NextRequest) => {
  await connectDB();
  return createOne(TourModel)(req);
};


export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectDB();
  return updateOne(TourModel)(req, { id });
}