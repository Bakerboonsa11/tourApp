// app/api/assign-guide/route.ts

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('body in email is  ',body)
    const { email,  tourName,des} = body;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Oromia Tours" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'You have been assigned as a guide 🎉',
      html: `
        <h1>You are assigned to guide the {tourName} Tour</h1>
        <p>Description: {des}</p>
        <p>If you can't guide this tour, contact us.</p>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
