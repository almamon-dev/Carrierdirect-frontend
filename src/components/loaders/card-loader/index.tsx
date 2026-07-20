import React from 'react';

export interface CardLoaderProps {
    className?: string;
}

export default function CardLoader({ className }: CardLoaderProps) {
    return (
        <div className={className}>
            {/* CardLoader Component */}
        </div>
    );
}
