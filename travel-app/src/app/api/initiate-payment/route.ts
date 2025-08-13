// app/api/initiate-payment/route.ts
import { NextResponse } from 'next/server';
import BookingModel from '@/model/bookings';
import { connectDB } from '@/lib/db';
export async function POST(request: Request) {
 const body = await request.json();
 const { amount, email, first_name, last_name, phone_number, tx_ref, return_url, tourId,userEmail } = body;
 console.log("Request body:", body);
  console.log("Tour ID and User ID from request body:", tourId);
 
  await connectDB();
  const existing = await BookingModel.findOne({ tour: tourId, email: userEmail });
if (existing) {
  return NextResponse.json({ message: 'You have already booked this tour.' }, { status: 400 });
}
   

  const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'ETB',
      userEmail,
      first_name,
      phone_number,
      tx_ref,
      return_url,
      metadata: {
        tourId,
        // optional: userId if needed
      },
      customization: {
        title: "Oromia Tours",
        description: "Secure booking through Chapa",
        // logo: "https://yourdomain.com/logo.png",
        logo: "http://tour-app-smoky.vercel.app/visitoro2.png", // Use your actual logo URL

      }
    }),
  });
  
  

  const chapaData = await chapaRes.json();

  if (chapaData.status !== 'success') {
    return NextResponse.json({ error: 'Failed to initialize payment', details: chapaData }, { status: 500 });
  }

  return NextResponse.json({ checkout_url: chapaData.data.checkout_url });
}
