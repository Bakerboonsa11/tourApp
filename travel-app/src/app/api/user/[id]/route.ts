import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import UserModel from '@/model/user';
import { updateOne, deleteOne,getOne } from '../../../../lib/factoryfun';

// export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
//     console.log("the delete is hitted")
//   return deleteOne(userModel)(req, params);
// };

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const params=await context.params
  return deleteOne(UserModel)(req, params);
}

// export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
//   return updateOne(userModel)(req, params);
// };

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const params = await context.params;
  return updateOne(UserModel)(req, params);
}

// export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
//   await dbConnect();
//   console.log("entered a get one ")
//   return getOne(userModel)(req, context.params); // ✅ use context.params, not destructuring
// };
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const params = await context.params;
  return getOne(UserModel)(req, params);
}