import {connectDB }from '../../../../lib/db';
import TourModel from '@/model/tours';
import { getOne,createOne,updateOne,deleteOne } from '../../../../lib/factoryfun';

import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  await connectDB();

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id parameter' }), { status: 400 });
  }

  const context = { params: { id } };

  // Call getOne and expect it returns the response directly
  const result = await getOne(TourModel, req, context);

  // If getOne doesn't return a Response, wrap it here:
  if (result instanceof Response) {
    return result;
  }

  // Else convert to JSON response:
  return NextResponse.json(result);
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
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectDB();
  return deleteOne(TourModel)(req, { id });
}