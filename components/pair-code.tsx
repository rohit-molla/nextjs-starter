"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, QrCode, Hash, Copy, Check, Loader2, ChevronLeft, Phone } from "lucide-react";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useSoundEffects } from "@/hooks/use-sound";

const API_BASE = process.env.API_BASE || "https://pair-mega-iwes.onrender.com";

export function PairCode({ onQRClick }: { onQRClick: () => void }) {
  const t = useTranslations();
  const { playClick, playSuccess, playError } = useSoundEffects(0.15);
  const [view, setView] = useState<"idle" | "options" | "code_input" | "code_display">("idle");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pairCode, setPairCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGetStarted = () => {
    playClick();
    setView("options");
  };

  const handlePairWithCode = () => {
    playClick();
    setView("code_input");
  };

  const handleGenerateCode = async () => {
    const phone = phoneNumber.trim().replace(/[^0-9]/g, "");
    if (!phone) {
      setError("Please enter your phone number");
      playError();
      return;
    }

    setIsLoading(true);
    setError("");
    playClick();

    try {
      const response = await axios.get(`${API_BASE}/code?number=${phone}`);
      const code = response.data.code;

      if (code && code !== "Service Unavailable") {
        setPairCode(code);
        setView("code_display");
        playSuccess();
      } else {
        setError("Service temporarily unavailable");
        playError();
      }
    } catch (err) {
      console.error("Error generating code:", err);
      setError("Failed to generate code. Try again.");
      playError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pairCode).then(() => {
      setCopied(true);
      playSuccess();
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <motion.div
        layout
        transition={{ layout: { duration: 0.4, type: "spring", bounce: 0.2 } }}
        className="bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden w-full"
      >
        <motion.div layout className="p-6">
          <AnimatePresence mode="wait">
            {view === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleGetStarted}
                  className="group relative flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                >
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Get Started</span>
                </button>
              </motion.div>
            )}

            {view === "options" && (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-4"
              >
                <h3 className="text-xl font-bold text-center mb-2">Choose Method</h3>
                
                <button
                  onClick={onQRClick}
                  className="flex items-center gap-4 bg-muted/50 p-4 rounded-2xl hover:bg-muted transition-all border border-transparent hover:border-primary/20 text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold">Pair with QR</div>
                    <div className="text-sm text-muted-foreground">Scan a QR code to connect</div>
                  </div>
                </button>

                <button
                  onClick={handlePairWithCode}
                  className="flex items-center gap-4 bg-muted/50 p-4 rounded-2xl hover:bg-muted transition-all border border-transparent hover:border-primary/20 text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Hash className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold">Pair with Code</div>
                    <div className="text-sm text-muted-foreground">Enter phone number to get code</div>
                  </div>
                </button>

                <button
                  onClick={() => setView("idle")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  Cancel
                </button>
              </motion.div>
            )}

            {view === "code_input" && (
              <motion.div
                key="code_input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => setView("options")} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-bold">Pair with Code</h3>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter phone number (e.g. 880123...)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleGenerateCode()}
                      className="w-full bg-muted/50 border border-border/50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                    />
                  </div>

                  {error && (
                    <p className="text-destructive text-sm text-center font-medium">{error}</p>
                  )}

                  <button
                    onClick={handleGenerateCode}
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <span>Get Pair Code</span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {view === "code_display" && (
              <motion.div
                key="code_display"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-6 py-4"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Your Pairing Code</h3>
                  <p className="text-sm text-muted-foreground">Enter this code on your device to connect</p>
                </div>

                <div className="bg-muted p-8 rounded-3xl border-2 border-dashed border-primary/30 w-full flex items-center justify-center relative group">
                  <span className="text-4xl sm:text-5xl font-mono font-black tracking-[0.2em] text-primary">
                    {pairCode}
                  </span>
                </div>

                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 w-full bg-primary/10 hover:bg-primary/20 text-primary py-4 rounded-2xl font-bold transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setView("code_input")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Try another number
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
