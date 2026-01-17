import type { Metadata } from "next";
import "./globals.css";
import "./mobile-optimizations.css"; // Mobile-first touch optimizations
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketingModal } from "@/components/layout/MarketingModal";
import { MarketingBanner } from "@/components/layout/MarketingBanner";
import { EmailPopup } from "@/components/layout/EmailPopup";

export const metadata: Metadata = {
  title: "Black Stone - Premium Professional Clothing",
  description: "Your destination for premium, professional clothing. Timeless elegance meets modern sophistication. Cash on Delivery available.",
};

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import SessionProvider from '@/components/providers/SessionProvider';
import { Suspense } from 'react';
import { ConditionalWrapper } from "@/components/layout/ConditionalWrapper";

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
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <ConditionalWrapper>
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
                </ConditionalWrapper>
              </div>
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
