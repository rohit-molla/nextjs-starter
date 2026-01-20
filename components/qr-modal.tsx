'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRModal({ isOpen, onClose }: QRModalProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Initializing...',
    type: 'info',
  });
  const [isLoading, setIsLoading] = useState(false);
  const isGeneratingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Generate QR Code
  const generateQR = async () => {
    if (isGeneratingRef.current) return;

    isGeneratingRef.current = true;
    setIsLoading(true);

    try {
      setStatus({ message: 'Connecting to WhatsApp servers...', type: 'info' });

      // Client-side call to server-side API endpoint
      const response = await axios.get('/api/qr', { timeout: 45000 });

      if (response.data?.success && response.data?.qr) {
        setSessionId(response.data.sessionId);
        setQrCode(response.data.qr);
        setStatus({ message: 'QR Code ready! Scan with WhatsApp', type: 'success' });

        // Auto-refresh QR after 45 seconds
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          if (sessionId === response.data.sessionId) {
            setStatus({ message: 'QR Code expired. Refreshing...', type: 'info' });
            refreshQR();
          }
        }, 45000);
      } else {
        throw new Error(response.data?.error || 'Invalid response');
      }
    } catch (error: any) {
      console.error('QR generation error:', error);

      let errorMessage = 'Failed to generate QR code';
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Connection timeout. Retrying...';
        setTimeout(refreshQR, 2000);
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setStatus({ message: errorMessage, type: 'error' });
    } finally {
      isGeneratingRef.current = false;
      setIsLoading(false);
    }
  };

  // Refresh QR Code
  const refreshQR = async () => {
    if (sessionId) {
      await axios.delete(`/api/qr/cleanup/${sessionId}`).catch(console.error);
    }
    setQrCode(null);
    setSessionId(null);
    await generateQR();
  };

  // Initial generation
  useEffect(() => {
    if (isOpen && !qrCode && !isGeneratingRef.current) {
      const timer = setTimeout(generateQR, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (sessionId) {
        axios.delete(`/api/qr/cleanup/${sessionId}`).catch(console.error);
      }
    };
  }, [sessionId]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (sessionId) {
          axios.delete(`/api/qr/cleanup/${sessionId}`).catch(console.error);
        }
      } else {
        if (!isGeneratingRef.current) {
          refreshQR();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sessionId]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionId) {
        navigator.sendBeacon(`/api/qr/cleanup/${sessionId}`);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-lg font-semibold">Connect WhatsApp</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* QR Display with Blur Background Effect */}
                <div className="mb-6 relative">
                  {/* Blurred background layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-xl blur-2xl"></div>
                  
                  {/* Radial glow effect */}
                  <div className="absolute inset-0 bg-radial rounded-xl opacity-20 blur-3xl bg-gradient-to-br from-primary via-transparent to-transparent"></div>
                  
                  {/* QR Container */}
                  <div className="relative bg-muted/50 rounded-xl p-8 min-h-[280px] flex items-center justify-center backdrop-blur-sm border border-primary/10">
                    {/* Subtle vignette effect */}
                    <div className="absolute inset-0 rounded-xl" style={{
                      background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.1) 100%)',
                      pointerEvents: 'none'
                    }}></div>
                    
                    {/* QR Code Content */}
                    <div className="relative z-10">
                      {qrCode ? (
                        <motion.img
                          key={qrCode}
                          src={qrCode}
                          alt="WhatsApp QR Code"
                          className="w-64 h-64 object-contain drop-shadow-2xl"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        />
                      ) : isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
                          <p className="text-sm text-muted-foreground">Generating QR...</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                <div className={`p-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2 ${
                  status.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                  status.type === 'error' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                  'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}>
                  {status.message}
                </div>

                {/* Instructions */}
                <p className="text-xs text-muted-foreground mb-4">
                  Open WhatsApp on your phone and scan this QR code with "Link device" option.
                </p>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-border/50 bg-muted/30">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={refreshQR}
                  disabled={isLoading}
                >
                  <RotateCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
