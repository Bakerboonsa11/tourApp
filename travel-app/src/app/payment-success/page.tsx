'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

        if (res.ok) {
          setStatus('success');
          setMessage(`Booking Confirmed! Booking ID: ${data.booking._id}`);
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

  if (status === 'loading') return <p>Verifying your payment...</p>;
  if (status === 'fail') return <p className="text-red-600">{message}</p>;

  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold text-emerald-700">🎉 Payment Successful</h1>
      <p className="mt-4 text-lg">{message}</p>
      <p className="mt-2">Thank you for your booking!</p>
    </div>
  );
}
