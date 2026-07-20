import React from 'react';

export interface ToastProps {
    className?: string;
}

export default function Toast({ className }: ToastProps) {
    return (
        <div className={className}>
            {/* Toast Component */}
        </div>
    );
}
