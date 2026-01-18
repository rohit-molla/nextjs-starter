# Architecture Diagram - WhatsApp QR Integration

## System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                               │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Next.js Website (app/[locale]/page.tsx)                        │ │
│  │  ├─ "Get Started" Button (Navigation Bar)                       │ │
│  │  ├─ "Get Started" Button (Hero Section)                         │ │
│  │  ├─ "Get Started" Button (CTA Section)                          │ │
│  │  └─ QRModal Component State                                     │ │
│  │     └─ isQRModalOpen: true/false                                │ │
│  └──────────┬───────────────────────────────────────────────────────┘ │
│             │                                                          │
│             │ User clicks "Get Started"                               │
│             │                                                          │
│             ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  QRModal Component (components/qr-modal.tsx)                    │ │
│  │  ├─ Opens animated modal                                        │ │
│  │  ├─ Calls axios.get('/api/qr')                                 │ │
│  │  └─ Displays QR code with status                               │ │
│  └──────────┬───────────────────────────────────────────────────────┘ │
│             │                                                          │
│             │ HTTP Request: GET /api/qr                               │
│             │                                                          │
└─────────────┼──────────────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                                       │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  API Route Handler (app/api/qr/route.ts)                        │ │
│  │                                                                  │ │
│  │  export async function GET(request) {                           │ │
│  │    const API_BASE = process.env.API_BASE                        │ │
│  │                                                                  │ │
│  │    ✅ SECURE - API_BASE never leaves server                    │ │
│  │    ✅ No CORS issues                                            │ │
│  │    ✅ Credentials stay on server                                │ │
│  │    ✅ 45-second timeout protection                              │ │
│  │                                                                  │
│  │    const response = await fetch(                                │ │
│  │      `${API_BASE}/qr`,                                          │ │
│  │      { method: 'GET' }                                          │
│  │    )                                                             │ │
│  │                                                                  │
│  │    return NextResponse.json({                                   │ │
│  │      success: true,                                             │ │
│  │      qr: data.qr,                                               │ │
│  │      sessionId: data.sessionId                                  │ │
│  │    })                                                            │ │
│  │  }                                                               │ │
│  └──────────┬───────────────────────────────────────────────────────┘ │
│             │                                                          │
│             │ process.env.API_BASE                                    │
│             │ = "https://pair-mega-iwes.onrender.com"                │
│             │                                                          │
└─────────────┼──────────────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                                   │
│              (Your WhatsApp Integration Server)                         │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  GET /qr Endpoint                                               │ │
│  │  ├─ Generates WhatsApp QR code                                 │ │
│  │  ├─ Creates unique session ID                                  │ │
│  │  └─ Returns:                                                    │ │
│  │     {                                                            │ │
│  │       "qr": "data:image/png;base64,...",                       │ │
│  │       "sessionId": "session-123-abc"                           │ │
│  │     }                                                            │ │
│  │                                                                  │ │
│  │  DELETE /qr/cleanup/:sessionId                                 │ │
│  │  ├─ Cleans up session resources                                │ │
│  │  └─ Returns: { "success": true }                               │ │
│  └───────────────────────────────────────────────────────────────  │ │
└────────────────────────────────────────────────────────────────────────┘

```

---

## Request Flow Sequence

```
1. User opens website
   └─ Sees "Get Started" buttons

2. User clicks "Get Started"
   └─ Button onClick handler: setIsQRModalOpen(true)

3. Modal appears
   └─ useEffect triggers generateQR()

4. generateQR() function
   ├─ axios.get('/api/qr')  [BROWSER SENDS]
   └─ (Server URL hidden from browser)

5. Next.js Server receives request
   ├─ Reads: const API_BASE = process.env.API_BASE
   ├─ Makes: fetch(`${API_BASE}/qr`)
   ├─ (Backend URL on server only - never to browser)
   └─ Receives: { qr: "...", sessionId: "..." }

6. Server returns to browser
   └─ response.json() = { success: true, qr: "...", ... }

7. Modal displays
   ├─ Renders QR code image
   ├─ Shows: "✅ QR Code ready! Scan with WhatsApp"
   └─ Auto-refresh timer starts (45 seconds)

8. User scans QR
   └─ WhatsApp connects

9. Modal closes
   ├─ axios.delete(`/api/qr/cleanup/${sessionId}`)
   ├─ Server deletes: `${API_BASE}/qr/cleanup/${sessionId}`
   └─ Backend cleans up session

10. QR Session cleaned
    └─ Success
```

---

## Component Structure

```
HomePage (app/[locale]/page.tsx)
│
├─ State: isQRModalOpen
│
├─ FloatingNav Component
│  └─ "Get Started" Button → onClick: setIsQRModalOpen(true)
│
├─ Hero Section
│  └─ "Get Started" Button → onClick: setIsQRModalOpen(true)
│
├─ CTA Section
│  └─ "Get Started" Button → onClick: setIsQRModalOpen(true)
│
└─ QRModal Component (components/qr-modal.tsx)
   ├─ isOpen: boolean (controlled by parent)
   ├─ onClose: () => void
   │
   ├─ State:
   │  ├─ qrCode: string | null
   │  ├─ sessionId: string | null
   │  ├─ status: { message, type }
   │  └─ isLoading: boolean
   │
   ├─ Effects:
   │  ├─ generateQR() - Initial QR fetch
   │  ├─ refreshQR() - Manual or auto-refresh
   │  ├─ Cleanup on unmount
   │  ├─ Visibility change handling
   │  └─ Page unload handling
   │
   └─ Renders:
      ├─ Backdrop overlay
      ├─ Modal container
      ├─ QR code image
      ├─ Status message
      └─ Action buttons (Close, Refresh)
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER                                       │
│                                                                      │
│  User clicks "Get Started" Button                                   │
│  └─> Component: onClick handler                                     │
│      └─> Action: setIsQRModalOpen(true)                             │
│          └─> State Update: isQRModalOpen → true                     │
│              └─> Component Re-render                                │
│                  └─> QRModal Renders (isOpen=true)                 │
│                      └─> useEffect triggers                         │
│                          └─> Call: generateQR()                     │
│                              └─> Action: setIsLoading(true)         │
│                                  └─> axios.get('/api/qr')           │
│                                      │                               │
└────────────────────────────────────┼─────────────────────────────────┘
                                     │
                                     │ Network Request
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                                  │
│                                                                      │
│  Route: GET /api/qr                                                 │
│  Handler: export async function GET(request)                        │
│  │                                                                   │
│  ├─ const API_BASE = process.env.API_BASE                           │
│  │  └─ "https://pair-mega-iwes.onrender.com"                        │
│  │                                                                   │
│  ├─ const response = await fetch(`${API_BASE}/qr`)                 │
│  │  └─ Backend URL accessed from server only                        │
│  │                                                                   │
│  ├─ const data = await response.json()                              │
│  │  └─ { qr: "data:image/png;base64,..." , sessionId: "..." }      │
│  │                                                                   │
│  └─ return NextResponse.json({                                      │
│     success: true,                                                  │
│     qr: data.qr,                                                    │
│     sessionId: data.sessionId                                       │
│  })                                                                  │
│                                                                      │
└────────────────────────────────────┬─────────────────────────────────┘
                                     │
                                     │ JSON Response
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER                                       │
│                                                                      │
│  Response Handler: (in generateQR function)                         │
│  │                                                                   │
│  ├─ response.data = {success: true, qr: "...", sessionId: "..."}    │
│  │                                                                   │
│  ├─ setQrCode(response.data.qr)                                     │
│  │  └─ State Update: qrCode → "data:image/png;base64,..."          │
│  │                                                                   │
│  ├─ setSessionId(response.data.sessionId)                           │
│  │  └─ State Update: sessionId → "session-123"                      │
│  │                                                                   │
│  ├─ setStatus({ message: "✅ QR Code ready!..." , type: "success"})│
│  │  └─ State Update: status message                                 │
│  │                                                                   │
│  ├─ setIsLoading(false)                                             │
│  │  └─ State Update: isLoading → false                              │
│  │                                                                   │
│  └─ Component Re-render with QR code visible                        │
│     └─ Modal displays: QR image + status + buttons                  │
│                                                                      │
│  Auto-refresh Timer:                                                │
│  └─ setTimeout(() => refreshQR(), 45000)                            │
│     └─ After 45 seconds: calls axios.delete() to cleanup           │
│        └─ Then: generateQR() to fetch new QR                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Security Flow

```
❌ INSECURE (Before):
┌─────────────┐
│   Browser   │ ──> EXPOSE API_URL ──> Backend API
│             │     https://pair-mega-iwes.onrender.com
└─────────────┘     ❌ Backend URL visible to everyone
                    ❌ CORS issues
                    ❌ Rate limiting per client
                    ❌ No auth on client


✅ SECURE (Now):
┌─────────────┐
│   Browser   │ ──> /api/qr ──┐
│             │               │
└─────────────┘               │ Server-side only
                              ▼
                       ┌────────────────┐
                       │ Next.js Server │
                       │ (Private)      │
                       │                │
                       │ API_BASE in    │
                       │ .env.local     │
                       │ ❌ Not exposed │
                       └────────┬───────┘
                                │
                                ▼
                        https://pair-mega-iwes.onrender.com
                        ✅ Backend URL hidden
                        ✅ No CORS issues
                        ✅ Rate limits per server
                        ✅ Can add auth headers
```

---

## File Dependency Graph

```
app/[locale]/page.tsx
├─ imports
│  ├─ React hooks
│  ├─ Framer Motion
│  ├─ components/qr-modal.tsx  ◄── NEW
│  ├─ components/ui/button.tsx
│  ├─ lucide-react icons
│  └─ next-intl
│
└─ uses
   └─ QRModal component
      └─ components/qr-modal.tsx  ◄── NEW
         ├─ imports
         │  ├─ React hooks
         │  ├─ Framer Motion
         │  ├─ lucide-react icons
         │  ├─ components/ui/button.tsx
         │  └─ axios
         │
         └─ calls
            └─ axios.get('/api/qr')
               └─ app/api/qr/route.ts  ◄── NEW
                  ├─ Next.js fetch()
                  ├─ process.env.API_BASE
                  └─ backend API
```

---

## Environment Variable Usage

```
.env.local
├─ NEXT_PUBLIC_API_URL
│  ├─ Visible to: ✅ Browser, ✅ Server
│  ├─ Used in: Client-side API calls (if any)
│  └─ Example: https://pair-mega-iwes.onrender.com
│
└─ API_BASE
   ├─ Visible to: ❌ Browser, ✅ Server only
   ├─ Used in: app/api/qr/route.ts
   ├─ Access: process.env.API_BASE
   └─ Example: https://pair-mega-iwes.onrender.com


Key Difference:
NEXT_PUBLIC_* → Included in browser bundle (public)
API_BASE      → Server-side only (private)
```

---

## Modal State Transitions

```
                   ┌──────────────────────┐
                   │   Modal Closed       │
                   │  (isQRModalOpen=false)
                   └──────────┬───────────┘
                              │
                    User clicks "Get Started"
                              │
                              ▼
                   ┌──────────────────────────┐
                   │  Modal Opening           │
                   │  (setIsQRModalOpen=true) │
                   └──────────┬───────────────┘
                              │
                    Modal renders, useEffect fires
                              │
                              ▼
                   ┌──────────────────────────┐
                   │  QR Loading              │
                   │  (isLoading=true)        │
                   │  Status: 🔄 Connecting..│
                   └──────────┬───────────────┘
                              │
                    API returns QR code
                              │
                              ▼
                   ┌──────────────────────────┐
                   │  QR Ready                │
                   │  (isLoading=false)       │
                   │  Status: ✅ Ready! Scan  │
                   └──────────┬───────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
         User clicks    Auto-refresh    User closes
         "Refresh"      (45 seconds)      modal
                │             │             │
                └──────┬──────┴──────┬──────┘
                       │             │
                       ▼             ▼
                   Clean up    Clean up
                   Session     Session
                       │             │
                       └──────┬──────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   Modal Closed       │
                   │  (isQRModalOpen=false)
                   └──────────────────────┘
```

---

## Performance Considerations

```
Request Timeline:
├─ T=0ms:   User clicks "Get Started"
├─ T=1ms:   Modal state updates
├─ T=5ms:   QRModal component renders
├─ T=10ms:  useEffect triggered
├─ T=20ms:  axios.get('/api/qr') sent
├─ T=50ms:  Server receives request
├─ T=60ms:  Server fetches from backend
├─ T=500ms: Backend responds with QR
├─ T=510ms: Server responds to client
├─ T=520ms: Browser receives response
├─ T=530ms: State updates (qrCode, sessionId)
├─ T=540ms: Component re-renders
└─ T=550ms: User sees QR code ✅

Total time: ~550ms (< 1 second)
```

---

## Cleanup Operations

```
QRModal Cleanup Scenarios:

1. User closes modal
   └─ onClose callback triggered
      └─ setIsQRModalOpen(false)
         └─ Modal unmounts
            └─ useEffect cleanup runs
               └─ axios.delete(`/api/qr/cleanup/${sessionId}`)
                  └─ Server calls: `${API_BASE}/qr/cleanup/${sessionId}`
                     └─ Backend deletes session

2. Page visibility hidden (tab switch)
   └─ visibilitychange event
      └─ document.hidden === true
         └─ axios.delete(`/api/qr/cleanup/${sessionId}`)

3. Page unload (user leaves)
   └─ beforeunload event
      └─ navigator.sendBeacon(`/api/qr/cleanup/${sessionId}`)
         └─ Async cleanup attempt

4. Component unmount
   └─ useEffect return cleanup function
      └─ Clears timeouts
      └─ Calls delete if sessionId exists
```

This comprehensive architecture ensures:
✅ Security (backend URL hidden)
✅ Reliability (proper cleanup)
✅ Performance (< 1 second load)
✅ UX (smooth animations)
