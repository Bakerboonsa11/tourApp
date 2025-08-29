import { NextResponse } from 'next/server';
import BookingModel from '@/model/bookings';
import { connectDB } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, first_name, last_name, phone_number, tourId, userEmail } = body;

  await connectDB();
  const existing = await BookingModel.findOne({ tour: tourId, email: userEmail });
  if (existing) {
    return NextResponse.json({ message: 'You have already booked this tour.' }, { status: 400 });
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tour-app-smoky.vercel.app';
  
  const tx_ref = `tx-${tourId}-${Date.now()}`;

  const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'ETB',
      email: userEmail,
      first_name,
      last_name,
      phone_number,
      tx_ref,
      return_url: `${BASE_URL}/payment-success?tx_ref=${tx_ref}`, 
      metadata: { tourId },
      customization: {
        title: "Explore Ethiopia with",
        description: "Secure booking through Chapa",
        logo: `${BASE_URL}/ethio4.webp`,
      }
    }),
  });
  

  const chapaData = await chapaRes.json();

  if (chapaData.status !== 'success') {
    return NextResponse.json({ error: 'Failed to initialize payment', details: chapaData }, { status: 500 });
  }

  return NextResponse.json({ checkout_url: chapaData.data.checkout_url });
}
