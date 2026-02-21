'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? '';

/**
 * FacebookPixel — loads the FB Pixel script once and fires PageView on every route change.
 * E-commerce events (ViewContent, AddToCart, Purchase, etc.) are fired
 * individually via src/lib/fpixel.ts helpers inside page/component code.
 */
export const FacebookPixel = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Fire PageView on route changes (after Pixel is already loaded by the Script below)
    useEffect(() => {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
            window.fbq('track', 'PageView');
        }
    }, [pathname, searchParams]);

    if (!PIXEL_ID) return null; // Don't render anything if pixel ID is missing

    return (
        <>
            {/* Official FB Pixel base code — Next.js loads this once, async, after interaction */}
            <Script
                id="fb-pixel-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
`,
                }}
            />
            {/* NoScript fallback for users with JS disabled */}
            <noscript>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    );
};
