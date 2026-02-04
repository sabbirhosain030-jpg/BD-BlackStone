import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketingModal } from "@/components/layout/MarketingModal";
import { MarketingBanner } from "@/components/layout/MarketingBanner";
import { EmailPopup } from "@/components/layout/EmailPopup";
import { MobileNav } from "@/components/layout/MobileNav";

import { FacebookPixel } from "@/components/analytics/FacebookPixel";

export const metadata: Metadata = {
  metadataBase: new URL('https://bdblackstone.com'),
  title: "Black Stone - Premium Professional Clothing",
  description: "Your destination for premium, professional clothing. Timeless elegance meets modern sophistication. Cash on Delivery available.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1, // Disable zoom
  userScalable: false, // Prevent manual zooming
  viewportFit: 'cover',
  themeColor: '#1a1a1a',
};

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import SessionProvider from '@/components/providers/SessionProvider';
import { Suspense, lazy } from 'react';
import { ConditionalWrapper } from "@/components/layout/ConditionalWrapper";

// Lazy load ChatBot to reduce initial bundle size
const ChatBot = lazy(() => import("@/components/chat/ChatBot"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
                <ConditionalWrapper>
                  {/* Facebook Pixel for Ad Tracking */}
                  <Suspense fallback={null}>
                    <FacebookPixel />
                  </Suspense>
                  <MarketingBanner />
                  <Suspense fallback={<div style={{ height: '80px' }} />}>
                    <Header />
                  </Suspense>
                  <Suspense fallback={null}>
                    <EmailPopup />
                  </Suspense>
                </ConditionalWrapper>

                <main style={{ flex: 1 }}>
                  {children}
                </main>

                <ConditionalWrapper>
                  <Footer />
                  <MobileNav />
                  {/* Live Chat Bot - Lazy loaded for performance */}
                  <Suspense fallback={null}>
                    <ChatBot />
                  </Suspense>
                </ConditionalWrapper>
              </div>
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
