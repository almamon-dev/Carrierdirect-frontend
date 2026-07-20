import React from 'react';

export interface PageTitleProps {
    className?: string;
    children?: React.ReactNode;
}

export default function PageTitle({ className = '', children }: PageTitleProps) {
    return (
        <h1 className={`text-2xl font-bold text-gray-900 ${className}`}>
            {children || "Page Title"}
        </h1>
    );
}
