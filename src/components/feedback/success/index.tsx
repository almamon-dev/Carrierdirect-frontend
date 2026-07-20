import React from 'react';

export interface SuccessProps {
    className?: string;
}

export default function Success({ className }: SuccessProps) {
    return (
        <div className={className}>
            {/* Success Component */}
        </div>
    );
}
