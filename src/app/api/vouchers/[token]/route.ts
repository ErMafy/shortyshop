import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const voucher = await db.getVoucherByToken(token);

    if (!voucher) {
      return NextResponse.json(
        { success: false, error: 'Voucher non trovato' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: voucher });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
