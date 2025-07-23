import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, tourName, price, duration,status,startDates } = await request.json();

 

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log("Sending email to:", email);
    await transporter.sendMail({
      from: `"Oromia Tours" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Tour Booking Confirmation 🎉',
      html: `
        <h1>Thank you for booking ${tourName}!</h1>
        <p>Your booking was successful.</p>
        <ul>
          <li><strong>Tour:</strong> ${tourName}</li>
          <li><strong>Price:</strong> $${price}</li>
          <li><strong>Start Date:</strong> ${startDates}</li>
          <li><strong>Duration:</strong> ${duration} days</li>
        </ul>
        <p>See you soon!</p>
      `,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
