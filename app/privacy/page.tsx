'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Last updated: January 20, 2026
              </p>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to X-Kira ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your data when you use our WhatsApp bot and website.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">2. Data Handling</h2>
                <p className="text-muted-foreground leading-relaxed">
                  X-Kira is a WhatsApp bot built with the @whiskeysockets/baileys library. We do not store your private messages on our servers. The bot operates by processing messages in real-time to execute commands.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Session data is stored locally on your deployment instance and is encrypted to ensure that only the bot can access your WhatsApp connection.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">3. No Third-Party Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information or WhatsApp data to outside parties. Your data remains within your own deployment environment.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">4. Open Source</h2>
                <p className="text-muted-foreground leading-relaxed">
                  X-Kira is open-source. You are encouraged to review the source code on our GitHub repository to verify our data handling practices and security measures.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-display font-bold">5. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us through our GitHub repository at{' '}
                  <a 
                    href="https://github.com/X-Kira/whatsapp-bot" 
                    className="text-primary hover:underline"
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
