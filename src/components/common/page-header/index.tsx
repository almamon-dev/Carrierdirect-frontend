import React from 'react';

export interface PageHeaderProps {
    className?: string;
    title?: string;
    description?: string;
    children?: React.ReactNode;
}

export default function PageHeader({ className = '', title = 'Page Title', description, children }: PageHeaderProps) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 ${className}`}>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            {children && <div className="mt-4 sm:mt-0">{children}</div>}
        </div>
    );
}
