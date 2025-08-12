'use client';
import { useEffect, useState, Suspense } from 'react';import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import PaymentSuccessPage  from './../../components/customComponent/payment-success'

export default function PaymentSuccessPageHome() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}



