import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_USERNAME } from '@/lib/stores';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Simple auth check (in production, use bcrypt + DB)
    if (username === ADMIN_USERNAME && password === 'shorty2024') {
      const response = NextResponse.json({ success: true });
      // Set a session cookie
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Credenziali non valide' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
