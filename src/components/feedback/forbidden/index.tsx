import React from 'react';

export interface ForbiddenProps {
    className?: string;
}

export default function Forbidden({ className }: ForbiddenProps) {
    return (
        <div className={className}>
            {/* Forbidden Component */}
        </div>
    );
}
