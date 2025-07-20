// app/api/initiate-payment/route.ts (Next.js App Router)

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount, email, first_name, last_name, phone_number, tx_ref, return_url } = await request.json();
  console.log("Payment request data:", { amount, email, first_name, last_name, phone_number, tx_ref, return_url });

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
    }),
  });

  const chapaData = await chapaRes.json();
  console.log("Chapa response data:", chapaData);

  if (chapaData.status !== 'success') {
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }

  return NextResponse.json({ checkout_url: chapaData.data.checkout_url });
}
