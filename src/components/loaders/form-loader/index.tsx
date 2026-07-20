import React from 'react';

export interface FormLoaderProps {
    className?: string;
}

export default function FormLoader({ className }: FormLoaderProps) {
    return (
        <div className={className}>
            {/* FormLoader Component */}
        </div>
    );
}
