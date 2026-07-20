import React from 'react';

export interface LoadingProps {
    className?: string;
}

export default function Loading({ className }: LoadingProps) {
    return (
        <div className={className}>
            {/* Loading Component */}
        </div>
    );
}
