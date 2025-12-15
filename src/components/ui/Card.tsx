import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    onClick
}) => {
    const classes = `card ${hover ? 'card-hover' : ''} ${className}`;

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
};
