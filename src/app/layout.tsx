import type { Metadata } from "next";
import "./globals.css";
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
import SessionProvider from '@/components/providers/SessionProvider';
import { Suspense } from 'react';

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
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <MarketingBanner />
              <Suspense fallback={<div style={{ height: '80px' }} />}>
                <Header />
              </Suspense>
              <Suspense fallback={null}>
                <EmailPopup />
              </Suspense>
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
