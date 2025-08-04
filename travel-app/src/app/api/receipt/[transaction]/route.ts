import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest, { params }: { params: { transaction: string } }) {
  const { transaction } = params;
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
    return NextResponse.json({ error: 'Failed to fetch receipt from Chapa' }, { status: 500 });
  }
}
