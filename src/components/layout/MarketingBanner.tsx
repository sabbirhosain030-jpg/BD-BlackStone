'use client';

import React from 'react';
import './MarketingBanner.css';

export const MarketingBanner: React.FC = () => {
    return (
        <div className="marketing-banner">
            <div className="marketing-banner-content">
                <span className="banner-text">
                    ✨ NEW YEAR SALE - Up to 40% OFF on Selected Items
                </span>
                <span className="banner-divider">•</span>
                <span className="banner-text">
                    FREE SHIPPING on Orders Over 5000 BDT
                </span>
                <span className="banner-divider">•</span>
                <span className="banner-text">
                    Use Code: WELCOME10 for 10% OFF
                </span>
                <span className="banner-divider">•</span>
                <span className="banner-text">
                    ✨ NEW YEAR SALE - Up to 40% OFF on Selected Items
                </span>
                <span className="banner-divider">•</span>
                <span className="banner-text">
                    FREE SHIPPING on Orders Over 5000 BDT
                </span>
                <span className="banner-divider">•</span>
                <span className="banner-text">
                    Use Code: WELCOME10 for 10% OFF
                </span>
            </div>
        </div>
    );
};
