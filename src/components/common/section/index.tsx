import React from 'react';

export interface SectionProps {
    className?: string;
    title?: string;
    description?: string;
    children?: React.ReactNode;
}

export default function Section({ className = '', title, description, children }: SectionProps) {
    return (
        <section className={`bg-white rounded-lg border shadow-sm ${className}`}>
            {(title || description) && (
                <div className="px-6 py-4 border-b border-gray-200">
                    {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
                    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </section>
    );
}
