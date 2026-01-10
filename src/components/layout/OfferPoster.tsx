import React from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export default async function OfferPoster() {
    // Fetch the latest active POSTER
    const poster = await prisma.marketingBanner.findFirst({
        where: {
            type: 'POSTER',
            isActive: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    if (!poster || !poster.image) return null;

    return (
        <section className="offer-poster-section" style={{ padding: '4rem 0' }}>
            <div className="container">
                <div style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    aspectRatio: '21/9' // Cinematic aspect ratio
                }}>
                    <Image
                        src={poster.image}
                        alt={poster.title || "Offer"}
                        fill
                        className="offer-poster-image"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="offer-content" style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '4rem',
                        color: 'white'
                    }}>
                        {poster.title && (
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(2rem, 5vw, 4rem)',
                                marginBottom: '1rem',
                                textTransform: 'uppercase',
                                lineHeight: 1.1,
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}>
                                {poster.title}
                            </h2>
                        )}
                        {poster.text && (
                            <p style={{
                                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                                maxWidth: '600px',
                                marginBottom: '2rem',
                                opacity: 0.9
                            }}>
                                {poster.text}
                            </p>
                        )}
                        <button className="btn btn-primary" style={{ alignSelf: 'flex-start', background: 'var(--color-white)', color: 'var(--color-charcoal)' }}>
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
