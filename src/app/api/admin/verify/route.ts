import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Codice voucher mancante' },
        { status: 400 }
      );
    }

    const voucher = await db.getVoucherByCode(code);
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
