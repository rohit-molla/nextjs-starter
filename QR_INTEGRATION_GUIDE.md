# WhatsApp QR Code Integration Guide

## Overview

This implementation adds WhatsApp QR code generation to your Next.js website with **server-side API fetching** for security. The "Get Started" button now opens a modal that displays a QR code for WhatsApp Web connection.

## Key Features

✅ **Server-Side Fetching** - API calls are made from the server, not exposed to the client  
✅ **Environment Variable Support** - Uses `API_BASE` for secure backend communication  
✅ **Auto-Refresh** - QR codes automatically refresh after 45 seconds  
✅ **Session Management** - Tracks sessions and cleans up on page unload  
✅ **Error Handling** - Comprehensive timeout and error handling  
✅ **Beautiful UI** - Smooth animations with Framer Motion  

## File Structure

```
app/
├── api/
│   └── qr/
│       └── route.ts          # Server-side QR generation endpoint
└── [locale]/
    └── page.tsx              # Updated with QR modal integration

components/
└── qr-modal.tsx              # QR Modal component
```

## Environment Configuration

Ensure your `.env.local` file has:

```env
API_BASE=https://your-backend-api.com
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

The `API_BASE` is used **only on the server**, keeping your backend URL secure from client-side exposure.

## How It Works

### 1. Server-Side Endpoint (`app/api/qr/route.ts`)

When the user clicks "Get Started", the client calls `/api/qr`:

```typescript
const response = await axios.get('/api/qr', { timeout: 45000 });
```

**Server-side processing:**
```typescript
const API_BASE = process.env.API_BASE;

export async function GET(request: NextRequest) {
  // Forward request to backend with server-side credentials
  const response = await fetch(`${API_BASE}/qr`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
  });
  
  // Return QR data to client
  return NextResponse.json({
    success: true,
    qr: data.qr,
    sessionId: data.sessionId,
  });
}
```

**Advantages:**
- Backend API URL is never exposed to the client
- Credentials and sensitive headers stay on the server
- CORS issues are handled automatically
- Timeout protection built-in

### 2. QR Modal Component (`components/qr-modal.tsx`)

The modal handles:
- QR code display with animations
- Session management
- Auto-refresh after 45 seconds
- Cleanup on visibility changes
- Error state management

### 3. Page Integration (`app/[locale]/page.tsx`)

The "Get Started" button is now connected:

```tsx
<Button 
  onClick={() => {
    playClick();
    setIsQRModalOpen(true);  // Opens QR Modal
  }}
>
  <Rocket className="w-4 h-4" />
  Get Started
</Button>

// Modal rendered at the end
<QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
```

## Integration Points

### Navigation Bar Button
Location: `[locale]/page.tsx` → `FloatingNav` component  
Action: Clicking opens the QR modal

### Hero CTA Button
Location: `[locale]/page.tsx` → Hero section  
Action: Clicking opens the QR modal

### Bottom CTA Section
Location: `[locale]/page.tsx` → CTA section  
Action: Clicking opens the QR modal

## API Endpoint Response Format

Your backend should respond with:

```json
{
  "qr": "data:image/png;base64,...",
  "sessionId": "unique-session-id-123"
}
```

## Cleanup & Session Management

The modal automatically:
- Cleans up sessions when the modal closes
- Sends beacon requests when the page unloads
- Handles visibility changes (tab switching)
- Refreshes QR when the page regains focus

```typescript
// Visibility change handling
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Clean up on page hide
    axios.delete(`/api/qr/cleanup/${sessionId}`);
  } else {
    // Refresh QR on page focus
    refreshQR();
  }
});
```

## Security Considerations

✅ **Backend URL Hidden** - `API_BASE` never reaches the browser  
✅ **No Client-Side Credentials** - All auth headers handled on server  
✅ **Timeout Protection** - 45-second timeout prevents hanging requests  
✅ **Session Cleanup** - Sessions are cleaned up to prevent orphaned connections  

## Usage

1. **Set environment variables** in `.env.local`:
   ```env
   API_BASE=https://your-api.com
   ```

2. **Test the modal**:
   - Run `pnpm dev`
   - Click "Get Started" button
   - QR code should load from server-side API

3. **Monitor in browser DevTools**:
   - Network tab shows `/api/qr` requests (client never sees backend URL)
   - Console shows generation status messages

## Customization

### Change QR Refresh Timeout
In `components/qr-modal.tsx`, modify:
```typescript
}, 45000);  // Change this value (milliseconds)
```

### Custom Error Messages
Update status messages in `generateQR()` function:
```typescript
setStatus({ message: 'Your custom message', type: 'error' });
```

### Modal Styling
Edit the Tailwind classes in `QRModal` component for colors, sizing, etc.

## Troubleshooting

**"API_BASE not configured" error:**
- Check `.env.local` file exists and has `API_BASE` set
- Restart dev server after env changes

**QR code not loading:**
- Verify backend API is running and accessible
- Check `/api/qr` endpoint in Network tab
- Look for error messages in console

**Modal won't close:**
- Check if any async operations are still running
- Clear sessionId properly on cleanup

## Next Steps

- Test with your actual WhatsApp backend
- Customize styling to match your brand
- Add analytics/tracking for "Get Started" clicks
- Consider adding retry logic for failed QR generation
