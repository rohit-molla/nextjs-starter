import { NextRequest, NextResponse } from 'next/server';

/**
 * QR Code Generation API Route (Server-side)
 * 
 * This endpoint generates WhatsApp QR codes using server-side fetching.
 * Uses API_BASE environment variable for secure backend communication.
 */

const API_BASE = process.env.API_BASE || "https://pair-mega-iwes.onrender.com";

if (!API_BASE) {
  console.warn('⚠️ API_BASE environment variable is not set');
}

/**
 * GET /api/qr
 * 
 * Generate a new QR code for WhatsApp connection
 * Server-side fetching ensures security and no client-side API exposure
 */
export async function GET(request: NextRequest) {
  try {
    if (!API_BASE) {
      return NextResponse.json(
        { success: false, error: 'API_BASE not configured' },
        { status: 500 }
      );
    }

    // Forward request to backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const response = await fetch(`${API_BASE}/qr`, {
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
        { success: false, error: errorData.error || 'Failed to generate QR' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      qr: data.qr,
      sessionId: data.sessionId,
    });
  } catch (error: any) {
    console.error('QR generation error:', error);

    let errorMessage = 'Failed to generate QR code';
    if (error.name === 'AbortError') {
      errorMessage = 'Connection timeout';
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/qr/cleanup/[sessionId]
 * 
 * Clean up QR session
 */
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.pathname.split('/').pop();

    if (!sessionId || !API_BASE) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 400 }
      );
    }

    await fetch(`${API_BASE}/qr/cleanup/${sessionId}`, {
      method: 'DELETE',
    }).catch(() => {
      // Cleanup failure is not critical
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ success: true }); // Still return success for cleanup
  }
}
