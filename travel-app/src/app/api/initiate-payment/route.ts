// app/api/initiate-payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount, email, first_name, last_name, phone_number, tx_ref, return_url, tourId, } = await request.json();
  console.log("Tour ID and User ID from request body:", tourId);

  const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'ETB',
      email,
      first_name,
      last_name,
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
        logo: "https://yourdomain.com/logo.png"
      }
    }),
  });
  
  

  const chapaData = await chapaRes.json();

  if (chapaData.status !== 'success') {
    return NextResponse.json({ error: 'Failed to initialize payment', details: chapaData }, { status: 500 });
  }

  return NextResponse.json({ checkout_url: chapaData.data.checkout_url });
}
