/**
 * Site Configuration
 * Central configuration for the application
 */

export const siteConfig = {
  name: 'X-Kira',
  description: 'X-Kira WhatsApp Bot made with @whiskeysockets/baileys library',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  
  // Links
  links: {
    github: 'https://github.com/X-Kira/whatsapp-bot',
    twitter: 'https://twitter.com/XKiraBot',
    docs: '/docs',
  },
  
  // Creator info
  creator: {
    name: 'X-Kira Team',
    username: 'X-Kira',
    url: 'https://github.com/X-Kira',
  },
  
  // SEO defaults
  seo: {
    titleTemplate: '%s | X-Kira',
    defaultTitle: 'X-Kira - WhatsApp Bot',
    defaultDescription:
      'X-Kira WhatsApp Bot made with @whiskeysockets/baileys library. Fast, reliable, and feature-rich.',
    keywords: [
      'WhatsApp Bot',
      'X-Kira',
      'Baileys',
      'Automation',
      'TypeScript',
      'WhatsApp API',
    ],
  },
  
  // Theme configuration
  theme: {
    defaultTheme: 'system' as const,
    themes: ['light', 'dark', 'system'] as const,
  },
  
  // Localization
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
  },
} as const;

export type SiteConfig = typeof siteConfig;

