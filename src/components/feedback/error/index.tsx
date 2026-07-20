import React from 'react';

export interface ErrorProps {
    className?: string;
}

export default function Error({ className }: ErrorProps) {
    return (
        <div className={className}>
            {/* Error Component */}
        </div>
    );
}
