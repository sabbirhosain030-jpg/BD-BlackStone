import React from 'react';

/* ============================================
   SKELETON LOADER COMPONENTS
   ============================================ */

// Base Skeleton
export const Skeleton = ({
    width = '100%',
    height = '1rem',
    className = '',
    borderRadius = '4px'
}: {
    width?: string | number;
    height?: string | number;
    className?: string;
    borderRadius?: string;
}) => (
    <div
        className={`skeleton ${className}`}
        style={{
            width,
            height,
            borderRadius,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite'
        }}
    />
);

// Product Card Skeleton
export const ProductCardSkeleton = () => (
    <div className="product-card-skeleton" style={{ padding: '1rem', background: '#fff', borderRadius: '8px' }}>
        <Skeleton height="250px" borderRadius="8px" />
        <div style={{ marginTop: '1rem' }}>
            <Skeleton width="70%" height="0.875rem" />
            <Skeleton width="100%" height="1rem" style={{ marginTop: '0.5rem' }} />
            <Skeleton width="40%" height="1.25rem" style={{ marginTop: '0.75rem' }} />
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Skeleton width="50%" height="2.5rem" borderRadius="6px" />
                <Skeleton width="50%" height="2.5rem" borderRadius="6px" />
            </div>
        </div>
    </div>
);

// Order Card Skeleton
export const OrderCardSkeleton = () => (
    <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Skeleton width="120px" height="1rem" />
            <Skeleton width="80px" height="1.5rem" borderRadius="12px" />
        </div>
        <Skeleton width="60%" height="0.875rem" />
        <Skeleton width="40%" height="0.875rem" style={{ marginTop: '0.5rem' }} />
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
            <Skeleton width="30%" height="1.25rem" />
        </div>
    </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
    <tr>
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} style={{ padding: '1rem' }}>
                <Skeleton height="1rem" />
            </td>
        ))}
    </tr>
);

/* ============================================
   SPINNER COMPONENTS
   ============================================ */

export const Spinner = ({ size = 'md', color = 'var(--color-gold)' }: { size?: 'sm' | 'md' | 'lg'; color?: string }) => {
    const sizes = {
        sm: '16px',
        md: '24px',
        lg: '40px'
    };

    return (
        <div
            className="spinner"
            style={{
                width: sizes[size],
                height: sizes[size],
                border: `3px solid ${color}33`,
                borderTop: `3px solid ${color}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                display: 'inline-block'
            }}
        />
    );
};

// Page Spinner (full screen)
export const PageSpinner = ({ message = 'Loading...' }: { message?: string }) => (
    <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)'
    }}>
        <Spinner size="lg" />
        {message && (
            <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                {message}
            </p>
        )}
    </div>
);

/* ============================================
   PROGRESS BAR
   ============================================ */

export const ProgressBar = ({ progress = 0, height = '4px', color = 'var(--color-gold)' }: {
    progress?: number;
    height?: string;
    color?: string;
}) => (
    <div style={{
        width: '100%',
        height,
        background: '#f0f0f0',
        borderRadius: '2px',
        overflow: 'hidden'
    }}>
        <div style={{
            width: `${progress}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s ease-in-out'
        }} />
    </div>
);

// Top Progress Bar (for page transitions)
export const TopProgressBar = ({ isLoading = false }: { isLoading?: boolean }) => {
    if (!isLoading) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            zIndex: 99999,
            background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-light) 100%)',
            animation: 'progressBar 2s ease-in-out infinite'
        }} />
    );
};

/* ============================================
   LOADING BUTTON
   ============================================ */

export const LoadingButton = ({
    loading = false,
    children,
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    variant = 'primary'
}: {
    loading?: boolean;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline';
}) => (
    <button
        type={type}
        onClick={onClick}
        disabled={loading || disabled}
        className={`btn btn-${variant} ${className} ${loading ? 'loading' : ''}`}
        style={{
            opacity: loading || disabled ? 0.6 : 1,
            cursor: loading || disabled ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
        }}
    >
        {loading && <Spinner size="sm" />}
        {loading ? 'Loading...' : children}
    </button>
);

/* ============================================
   SHIMMER EFFECT
   ============================================ */

export const shimmer = (width: number, height: number) => `
  <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f0f0f0" offset="20%" />
        <stop stop-color="#e0e0e0" offset="50%" />
        <stop stop-color="#f0f0f0" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#f0f0f0" />
    <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
  </svg>
`;

export const shimmerDataURL = (width: number, height: number) =>
    `data:image/svg+xml;base64,${Buffer.from(shimmer(width, height)).toString('base64')}`;

/* ============================================
   CSS ANIMATIONS (Add to global CSS)
   ============================================ */

export const LoadingStateStyles = () => (
    <style jsx global>{`
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes progressBar {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .skeleton {
      animation: shimmer 1.5s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton,
      .spinner {
        animation: none;
      }
    }
  `}</style>
);

export default {
    Skeleton,
    ProductCardSkeleton,
    OrderCardSkeleton,
    TableRowSkeleton,
    Spinner,
    PageSpinner,
    ProgressBar,
    TopProgressBar,
    LoadingButton,
    shimmer,
    shimmerDataURL,
    LoadingStateStyles
};
