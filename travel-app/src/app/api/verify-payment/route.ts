import { NextRequest, NextResponse } from 'next/server';
import BookingModel from '@/model/bookings';
import TourModel from '@/model/tours';
import { connectDB } from '@/lib/db';

export const GET = async (req: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get('tx_ref');

  if (!tx_ref) {
    return NextResponse.json({ message: 'No transaction reference provided' }, { status: 400 });
  }

  const [, id] = tx_ref.split('-'); // Extract tourId
  console.log("Extracted Tour ID:", id);

  const chapaRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
  });

  const chapaData = await chapaRes.json();
  console.log("Chapa verification response:", chapaData);

  if (chapaData.status !== 'success') {
    return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
  }

  const paymentInfo = chapaData.data;
  const userEmail = paymentInfo.email;

  if (!id || !userEmail) {
    return NextResponse.json({ message: 'Tour ID or email missing' }, { status: 400 });
  }

  const tour = await TourModel.findById(id);
  if (!tour) {
    return NextResponse.json({ message: 'Tour not found' }, { status: 404 });
  }

  // ✅ Map Chapa status to Booking schema-compatible value
  const mappedPaymentStatus = paymentInfo.status === 'success'
    ? 'paid'
    : paymentInfo.status === 'failed'
    ? 'failed'
    : 'pending';

  const booking = await BookingModel.create({
    tour: id,
    email: userEmail,
    price: paymentInfo.amount,
    paid: mappedPaymentStatus === 'paid',
    status: 'confirmed',
    transaction: {
      tx_ref: paymentInfo.tx_ref,
      chapa_id: paymentInfo.id,
      payment_method: 'chapa',
      payment_status: mappedPaymentStatus, // ✅ mapped value
      payment_date: new Date(paymentInfo.created_at),
    },
  });

  return NextResponse.json({ message: 'Booking confirmed', booking }, { status: 200 });
};
