// File: app/api/user/notform/[id]/route.ts

import { connectDB } from '@/lib/db';
import UserModel from '@/model/user'; // use the correct model
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import nodemailer from 'nodemailer';
import { RollerCoaster } from 'lucide-react';
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const body = await req.json();

  try {
    const objectId = new Types.ObjectId(params.id);
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
      const admin = await UserModel.findOne({ role: "admin" });
      const availabilityStatus = updatedUser.available ? "available" : "unavailable";
        console.log("Sending email to:", admin.email);
        await transporter.sendMail({
          from: `"Oromia Tours" <${process.env.EMAIL_USER}>`,
          to:admin.email,
          subject: 'we are notifiying u that  🎉',
          html: `
            <h1> guide ${updatedUser.name}! is ${availabilityStatus} to guide tours assigned for </h1>
            
            <ul>
              <li><strong>user:</strong> guide  ${updatedUser.name}</li>
              <li><strong>at:</strong> ${Date.now().toLocaleString()}</li>
          
            </ul>
            <p>try to connect him  through ${updatedUser.email} </p>
          `,
        });
    

    return NextResponse.json({ status: 'success', data: updatedUser });
  } catch (error) {
    console.error('Update error:', error);
    // return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
