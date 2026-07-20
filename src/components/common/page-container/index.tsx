import React from 'react';

export interface PageContainerProps {
    className?: string;
    children?: React.ReactNode;
}

export default function PageContainer({ className = '', children }: PageContainerProps) {
    return (
        <div className={`max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 ${className}`}>
            {children}
        </div>
    );
}
