import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
    variant?: 'card' | 'text' | 'button' | 'list';
    count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'card',
    count = 1
}) => {
    const renderSkeleton = () => {
        switch (variant) {
            case 'card':
                return (
                    <div className="skeleton-product-card">
                        <div className="skeleton skeleton-card-image"></div>
                        <div className="skeleton-card-content">
                            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                            <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                            <div className="skeleton skeleton-button"></div>
                        </div>
                    </div>
                );
            case 'text':
                return (
                    <>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                    </>
                );
            case 'button':
                return <div className="skeleton skeleton-button"></div>;
            case 'list':
                return (
                    <div className="skeleton-list-item">
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
                    </div>
                );
            default:
                return <div className="skeleton skeleton-card"></div>;
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index}>
                    {renderSkeleton()}
                </div>
            ))}
        </>
    );
};
