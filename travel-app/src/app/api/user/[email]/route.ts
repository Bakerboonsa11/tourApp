import { NextRequest,NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import UserModel from '@/model/user';
import nodemailer from 'nodemailer';



export async function DELETE(
  req: NextRequest 
) {
  await connectDB();

  // Destructure the email from the params object.

  const url = new URL(req.url);
  console.log('path is ', url);

  // Extract the last path segment (the email). The .pop() method can return undefined.
  const encodedEmail = url.pathname.split('/').pop();
  
  // Use a conditional check to ensure encodedEmail is a string before decoding.
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : undefined;

  console.log('email is ', email);

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
                <h1> dear our customer {deletedUser.name} you are not our user after thanck you for your time   </h1>
                
                <ul>
                  <li><strong>user:</strong> dear  {deletedUser.name}</li>
                  <li><strong>at:</strong> {Date.now().toLocaleString()}</li>
              
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


export async function PATCH(req: NextRequest) {
  await connectDB();

  await connectDB();

  // Destructure the email from the params object.

  const url = new URL(req.url);
  console.log('path is ', url);

  // Extract the last path segment (the email). The .pop() method can return undefined.
  const encodedEmail = url.pathname.split('/').pop();
  
  // Use a conditional check to ensure encodedEmail is a string before decoding.
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : undefined;

  console.log('email is ', email);
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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Oromia Tours" <${process.env.EMAIL_USER}>`,
      to: updatedUser.email,
      subject: 'we are notifiying u that  🎉',
      html: `
        <h1> dear our member  {updatedUser.name}! user data is changed sign in to website and see it </h1>
        
        <ul>
          <li><strong>user:</strong> user ure role is   {updatedUser.role}</li>
          <!-- CORRECTED: Use 'new Date()' to get a proper Date object before calling toLocaleString() -->
          <li><strong>at:</strong> {new Date().toLocaleString()}</li>
        </ul>
        <p>try and ur email is  {updatedUser.email} </p>
      `,
    });

    return NextResponse.json({ status: "success", updatedTo: updatedUser });
  }catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}


export const GET = async (req: NextRequest) => {

  // Connect to the database.
  await connectDB();

  // Destructure the email from the params object.

  const url = new URL(req.url);
  console.log('path is ', url);

  // Extract the last path segment (the email). The .pop() method can return undefined.
  const encodedEmail = url.pathname.split('/').pop();
  
  // Use a conditional check to ensure encodedEmail is a string before decoding.
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : undefined;

  console.log('email is ', email);


  if (!email) {
    return new Response(JSON.stringify({ error: 'Missing id parameter' }), { status: 400 });
  }

  try {
    console.log('Fetching user with email:', email);
    // Find the user in the database by their email.
    const doc = await UserModel.findOne({ email });
    console.log('Fetched user:', doc);

    // If no user is found, return a 404 error.
    if (!doc) {
      return NextResponse.json({ message: 'No document found' }, { status: 404 });
    }

    // Set up the nodemailer transporter for sending emails.
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // Send the notification email.
    // await transporter.sendMail({
    //   from: `"Oromia Tours" <${process.env.EMAIL_USER}>`,
    //   to: doc.email,
    //   subject: 'we are notifiying u that  🎉',
    //   html: `
    //     <h1> dear our member  ${doc.name}! user data is changed sign in to website and see it </h1>
        
    //     <ul>
    //       <li><strong>user:</strong> user ure role is   ${doc.role}</li>
    //       <!-- CORRECTED: Use 'new Date()' to get a proper Date object before calling toLocaleString() -->
    //       <li><strong>at:</strong> ${new Date().toLocaleString()}</li>
    //     </ul>
    //     <p>try and ur email is  ${doc.email} </p>
    //   `,
    // });

    // Return a success response with the user data.
    return NextResponse.json({ status: 'success', data: doc }, { status: 200 });
  } catch (err: unknown) {
    // Handle any errors that occur during the process.
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};





