'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { start } from 'repl';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const tx_ref = searchParams.get('tx_ref');
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!tx_ref) {
        setStatus('fail');
        setMessage('No transaction reference found.');
        return;
      }

      try {
        const res = await fetch(`/api/verify-payment?tx_ref=${tx_ref}`);
        const data = await res.json();
        console.log("Transaction Reference: afterrrrrrrrrrrrrrrrrrrrr",data );
        console.log("Verification Response:", data);
        if (res.ok) {
          setStatus('success');
          setMessage(`Booking Confirmed! Booking ID: ${data.booking._id}`);
          await axios.post('/api/payment-success', {
            email: data.userEmail, // ✅ use the correct key from response
            tourName: data.tourName,
            price: data.amount,
            startDate: data.startDate,
            duration: data.duration,
            status: data.status,
          });
          
        } else {
          setStatus('fail');
          setMessage(data.message || 'Verification failed.');
         
          
        }
      } catch (error) {
        console.error('Verification Error:', error);
        setStatus('fail');
        setMessage('Something went wrong.');
      }
    };

    verifyPayment();
  }, [tx_ref]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-emerald-600 mb-6"></div>
        <h2 className="text-2xl font-semibold text-gray-700">Verifying your payment...</h2>
        <p className="mt-4 text-gray-500">Please hold on while we confirm your transaction with our payment provider.</p>
        <p className="mt-2 text-sm text-gray-400">This should only take a few seconds.</p>
      </div>
    );
  }
  
  if (status === 'fail') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center p-10">
        <div className="text-6xl text-red-600 mb-4">❌</div>
        <h1 className="text-3xl font-bold text-red-700">Payment Failed</h1>
        <p className="mt-4 text-red-600 font-medium">{message}</p>
        <p className="mt-2 text-gray-600">Please double-check your payment information or try again later.</p>
        <a href="/contact" className="mt-4 inline-block bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition">Contact Support</a>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white text-center px-6 py-12 flex flex-col items-center justify-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-4xl font-bold text-emerald-700">Payment Successful</h1>
      <p className="mt-4 text-lg text-gray-700">{message}</p>
      <p className="mt-2 text-gray-500">Thank you for booking with us! We’re excited to host you.</p>
  
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
        <div className="p-6 bg-emerald-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-emerald-800">📍 Destination Info</h3>
          <p className="mt-2 text-gray-700">You will receive a full itinerary, directions, and local guide contact via email.</p>
        </div>
        <div className="p-6 bg-emerald-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-emerald-800">📅 Schedule</h3>
          <p className="mt-2 text-gray-700">Please check your email to see the starting time, location, and your reference number.</p>
        </div>
        <div className="p-6 bg-emerald-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-emerald-800">🎫 Booking Details</h3>
          <p className="mt-2 text-gray-700">All details and e-tickets are sent to your email. Bring your confirmation on the day.</p>
        </div>
        <div className="p-6 bg-emerald-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-emerald-800">🤝 Our Promise</h3>
          <p className="mt-2 text-gray-700">We are committed to providing you a comfortable and memorable experience.</p>
        </div>
        <div className="p-6 bg-emerald-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-emerald-800">📧 Need Help?</h3>
          <p className="mt-2 text-gray-700">Our support team is available 24/7. <a href="/contact" className="text-emerald-700 underline">Contact us</a> if you have any issues.</p>
        </div>
        <div className="p-6 bg-emerald-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-emerald-800">⭐ Rate Your Experience</h3>
          <p className="mt-2 text-gray-700">We had love your feedback after your trip. It helps us serve you better!</p>
        </div>
      </div>
  
      <a href="/my-bookings" className="mt-10 inline-block bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-800 transition">
        View My Bookings
      </a>
    </div>
  );
  
}
