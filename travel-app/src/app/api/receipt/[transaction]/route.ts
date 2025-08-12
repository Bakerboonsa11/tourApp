import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  // Extract transaction from URL pathname
  const url = new URL(req.url);
  const transaction = url.pathname.split('/').pop(); // last part of path

  if (!transaction) {
    return NextResponse.json(
      { error: 'Transaction ID is required' },
      { status: 400 }
    );
  }

  console.log('Fetching receipt for transaction:', transaction);

  try {
    const chapaRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${transaction}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    return NextResponse.json(chapaRes.data);
  } catch (error: any) {
    console.error('Chapa error:', error.response?.data || error?.message);
    return NextResponse.json(
      { error: 'Failed to fetch receipt from Chapa' },
      { status: 500 }
    );
  }
}
