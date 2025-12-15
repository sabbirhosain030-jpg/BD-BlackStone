import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './ProductCard.css';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    previousPrice?: number;
    image: string;
    category?: string;
    isNew?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    previousPrice,
    image,
    category,
    isNew
}) => {
    const discount = previousPrice ? Math.round(((previousPrice - price) / previousPrice) * 100) : 0;

    return (
        <Link href={`/products/${id}`} className="product-card hover-lift">
            <div className="product-image-wrapper">
                {isNew && <span className="product-badge badge-new">New</span>}
                {discount > 0 && <span className="product-badge badge-sale">-{discount}%</span>}
                <div className="product-image hover-zoom-img">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="image"
                    />
                </div>
                <div className="product-overlay">
                    <button className="quick-view-btn">Quick View</button>
                </div>
            </div>
            <div className="product-info">
                {category && <span className="product-category">{category}</span>}
                <h3 className="product-name">{name}</h3>
                <div className="product-price">
                    <span className="price-current">{price.toLocaleString()} BDT</span>
                    {previousPrice && (
                        <span className="price-previous">{previousPrice.toLocaleString()} BDT</span>
                    )}
                </div>
            </div>
        </Link>
    );
};
