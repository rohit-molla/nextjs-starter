'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="py-6 border-b border-border/40">
        <div className="container px-4 md:px-6 mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 tracking-tight">
              Terms & Conditions
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Last updated: January 20, 2026
              </p>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By using X-Kira WhatsApp Bot, you agree to comply with these terms. This bot is a tool for automation and should be used responsibly and in accordance with WhatsApp's Terms of Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">2. Usage Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to use X-Kira for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Spamming or sending unsolicited messages</li>
                  <li>Distributing malicious content or viruses</li>
                  <li>Harassing or threatening other users</li>
                  <li>Any illegal activities in your jurisdiction</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">3. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  X-Kira is provided "as is" without any warranties. We are not responsible for any account bans or data loss resulting from the use of this bot. Use at your own risk.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">4. MIT License</h2>
                <p className="text-muted-foreground leading-relaxed">
                  X-Kira is open-source software licensed under the MIT License. You are free to modify and distribute the code, provided that the original license and copyright notice are included.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">5. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For support or inquiries, please visit our GitHub repository:
                  <a 
                    href="https://github.com/X-Kira/whatsapp-bot" 
                    className="text-primary hover:underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/X-Kira/whatsapp-bot
                  </a>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} X-Kira. Developed by X-Kira Team.
          </p>
        </div>
      </footer>
    </div>
  );
}
