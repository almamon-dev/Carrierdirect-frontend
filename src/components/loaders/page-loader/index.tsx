import React from 'react';

export interface PageLoaderProps {
    className?: string;
}

export default function PageLoader({ className }: PageLoaderProps) {
    return (
        <div className={className}>
            {/* PageLoader Component */}
        </div>
    );
}
