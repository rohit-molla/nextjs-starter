import { NextRequest, NextResponse } from 'next/server';

/**
 * Pair Code Generation API Route (Server-side)
 * 
 * This endpoint generates WhatsApp pairing codes using server-side fetching.
 * Uses API_BASE environment variable for secure backend communication.
 */

const API_BASE = process.env.API_BASE || "https://pair-mega-iwes.onrender.com";

if (!API_BASE) {
  console.warn('⚠️ API_BASE environment variable is not set');
}

/**
 * GET /api/code
 * 
 * Generate a pairing code for WhatsApp connection
 * Accepts 'number' query parameter (phone number)
 * Server-side fetching ensures security and no client-side API exposure
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get('number');

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!API_BASE) {
      return NextResponse.json(
        { success: false, error: 'API_BASE not configured' },
        { status: 500 }
      );
    }

    // Forward request to backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${API_BASE}/code?number=${encodeURIComponent(phone)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.error || 'Failed to generate code' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.code || data.code === "Service Unavailable") {
      return NextResponse.json(
        { success: false, error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      code: data.code,
    });
  } catch (error: any) {
    console.error('Code generation error:', error);

    let errorMessage = 'Failed to generate code';
    if (error.name === 'AbortError') {
      errorMessage = 'Connection timeout';
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
