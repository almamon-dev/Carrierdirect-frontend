import React from 'react';

export interface AlertProps {
    className?: string;
}

export default function Alert({ className }: AlertProps) {
    return (
        <div className={className}>
            {/* Alert Component */}
        </div>
    );
}
