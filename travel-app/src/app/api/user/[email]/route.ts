import { NextRequest,NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import UserModel from '@/model/user';
import nodemailer from 'nodemailer';



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

     const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
            await transporter.sendMail({
              from: `"Oromia Tours" <${process.env.EMAIL_USER}>`,
              to:deletedUser.email,
              subject: 'we are notifiying u that  🎉',
              html: `
                <h1> dear our customer ${deletedUser.name} you are not our user after thanck you for your time   </h1>
                
                <ul>
                  <li><strong>user:</strong> dear  ${deletedUser.name}</li>
                  <li><strong>at:</strong> ${Date.now().toLocaleString()}</li>
              
                </ul>
                <p> hope see you again  </p>
              `,
            });

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
  console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
  await connectDB();
  const { email } = context.params;
  console.log('Email in POST: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', email);
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
     const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

    await transporter.sendMail({
      from: `"Oromia Tours" <${process.env.EMAIL_USER}>`,
      to:doc.email,
      subject: 'we are notifiying u that  🎉',
      html: `
        <h1> dear our memmber  ${doc.name}! user data is changed sign in to website and see it </h1>
        
        <ul>
          <li><strong>user:</strong> user ure role is   ${doc.role}</li>
          <li><strong>at:</strong> ${Date.now().toLocaleString()}</li>
      
        </ul>
        <p>try and ur email is  ${doc.email} </p>
      `,
    });

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