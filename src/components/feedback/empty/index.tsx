import React from 'react';

export interface EmptyProps {
    className?: string;
}

export default function Empty({ className }: EmptyProps) {
    return (
        <div className={className}>
            {/* Empty Component */}
        </div>
    );
}
