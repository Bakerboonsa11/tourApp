import { NextRequest,NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import UserModel from '@/model/user';
import { updateOne, deleteOne,getOne,createOne } from '../../../../lib/factoryfun';
import mongoose from 'mongoose';

// export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
//     console.log("the delete is hitted")
//   return deleteOne(userModel)(req, params);
// };

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  return deleteOne(UserModel)(req, context.params);
}
// export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
//   return updateOne(userModel)(req, params);
// };

export async function GET(
  req: NextRequest,
  context: { params: { email: string } }  // NOT Promise
) {
  await connectDB();
  const { email } = context.params;
  console.log('Email in POST:', email);
  if (!email) {
    return NextResponse.json({ message: 'No email provided' }, { status: 400 });
  }

  try {
    console.log('Fetching user with email:', email);
    const doc = await UserModel.findOne({ email });
    console.log('Fetched user:', doc);

    if (!doc) {
      return NextResponse.json({ message: 'No document found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', data: doc }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}


// export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
//   await dbConnect();
//   console.log("entered a get one ")
//   return getOne(userModel)(req, context.params); // ✅ use context.params, not destructuring
// };
// export async function GET(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   await connectDB();
//   return getOne(UserModel)(req, context.params);
// }

// export const POST = async (req: NextRequest) => {
//   await connectDB();
//   return createOne(UserModel)(req);
// };