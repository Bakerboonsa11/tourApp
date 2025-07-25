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
  context: { params: { email: string } }
) {
  await connectDB();
  const { email } = context.params;
  console.log('Email in DELETE:', email);

  try{
    const deletedUser = await UserModel.findOneAndDelete({ email });
    if (!deletedUser) {
      return NextResponse.json(
        { status: "fail", message: "No user found with this email" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: "success", deletedUser: deletedUser }, { status: 200 });
  }
  catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
  // return deleteOne(UserModel)(req, context.params);
}
// /app/api/user/[email]/route.ts


export async function PATCH(req: NextRequest, context: { params: { email: string } }) {
  await connectDB();

  const { email } = context.params;
  const body = await req.json();

  try {
    console.log("Update request for email:", email);
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { status: "fail", message: "No user found with this email" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", updatedTo: updatedUser });
  }catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
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