import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getStoreBySlug, STORES } from '@/lib/stores';
import { generateVoucherCode, generateRedeemToken } from '@/lib/voucher-utils';

export async function POST(request: NextRequest) {
  // Auth check
  const session = request.cookies.get('admin_session');
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json(
      { success: false, error: 'Non autorizzato' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { first_name, last_name, phone, email, store_slug, amount, expires_at } = body;

    // Basic validation
    if (!first_name?.trim() || !last_name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nome e cognome sono obbligatori' },
        { status: 400 }
      );
    }

    // Validate store
    const store = getStoreBySlug(store_slug);
    if (!store) {
      return NextResponse.json(
        { success: false, error: 'Negozio non valido. Slug validi: ' + STORES.map(s => s.slug).join(', ') },
        { status: 400 }
      );
    }

    // Validate amount
    const voucherAmount = Number(amount);
    if (!voucherAmount || voucherAmount <= 0 || voucherAmount > 500) {
      return NextResponse.json(
        { success: false, error: 'Importo non valido (min 0.01, max 500)' },
        { status: 400 }
      );
    }

    // Validate expiry date
    let expiryDate: string;
    if (expires_at) {
      const parsed = new Date(expires_at);
      if (isNaN(parsed.getTime()) || parsed <= new Date()) {
        return NextResponse.json(
          { success: false, error: 'Data di scadenza non valida o nel passato' },
          { status: 400 }
        );
      }
      expiryDate = parsed.toISOString();
    } else {
      // Default: 30 days from now
      const date = new Date();
      date.setDate(date.getDate() + 30);
      expiryDate = date.toISOString();
    }

    // Generate unique voucher code
    let voucherCode = generateVoucherCode(store_slug);
    let attempts = 0;
    while (await db.codeExists(voucherCode) && attempts < 10) {
      voucherCode = generateVoucherCode(store_slug);
      attempts++;
    }

    const redeemToken = generateRedeemToken();

    const voucher = await db.createVoucher({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      voucher_code: voucherCode,
      redeem_token: redeemToken,
      amount: voucherAmount,
      store_id: store.id,
      status: 'active',
      created_at: new Date().toISOString(),
      expires_at: expiryDate,
      used_at: null,
      used_by_admin: null,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: voucher.id,
        voucher_code: voucher.voucher_code,
        redeem_token: voucher.redeem_token,
        amount: voucher.amount,
        expires_at: voucher.expires_at,
        first_name: voucher.first_name,
        last_name: voucher.last_name,
        store: store,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
