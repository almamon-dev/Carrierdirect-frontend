import React from 'react';

export interface FormMessageProps {
    className?: string;
}

export default function FormMessage({ className }: FormMessageProps) {
    return (
        <div className={className}>
            {/* FormMessage Component */}
        </div>
    );
}
