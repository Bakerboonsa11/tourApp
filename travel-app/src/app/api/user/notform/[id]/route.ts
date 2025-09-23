import { connectDB } from '@/lib/db';
import UserModel from '@/model/user';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import nodemailer from 'nodemailer';

export async function PATCH(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1]; // extract id from path

  const body = await req.json();

  try {
    const objectId = new Types.ObjectId(id);
    console.log('Updating user with ID:', objectId, 'Data:', body);

    const updatedUser = await UserModel.findByIdAndUpdate(objectId, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const admin = await UserModel.findOne({ role: 'admin' });
    const availabilityStatus = updatedUser.available
      ? 'available'
      : 'unavailable';

    console.log('Sending email to:', admin?.email);

    if (admin?.email) {
      await transporter.sendMail({
        from: `"Oromia Tours" <${process.env.EMAIL_USER}>`,
        to: admin.email,
        subject: 'We are notifying you 🎉',
        html: `
          <h1>Guide {updatedUser.name} is {availabilityStatus} to guide assigned tours</h1>
          <ul>
            <li><strong>User:</strong> Guide {updatedUser.name}</li>
            <li><strong>At:</strong> {new Date().toLocaleString()}</li>
          </ul>
          <p>Try to connect through {updatedUser.email}</p>
        `,
      });
    }

    return NextResponse.json({ status: 'success', data: updatedUser });
  } catch (error: unknown) {
    console.error('Update error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
