import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voucher_id, admin_id } = body;

    if (!voucher_id) {
      return NextResponse.json(
        { success: false, error: 'ID voucher mancante' },
        { status: 400 }
      );
    }

    // Check the voucher exists first
    const voucher = await db.getVoucherById(voucher_id);
    if (!voucher) {
      return NextResponse.json(
        { success: false, error: 'Voucher non trovato' },
        { status: 404 }
      );
    }

    if (voucher.status === 'used') {
      return NextResponse.json(
        { success: false, error: 'Questo voucher è già stato utilizzato' },
        { status: 400 }
      );
    }

    if (voucher.status === 'expired' || new Date(voucher.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Questo voucher è scaduto' },
        { status: 400 }
      );
    }

    const success = await db.markAsUsed(voucher_id, admin_id || 'admin');
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Impossibile aggiornare il voucher' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Voucher segnato come utilizzato' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
