import React from 'react';

export interface BreadcrumbProps {
    className?: string;
    items?: { label: string; href?: string }[];
}

export default function Breadcrumb({ className = '', items = [] }: BreadcrumbProps) {
    return (
        <nav className={`flex text-sm text-gray-500 ${className}`}>
            {items.map((item, index) => (
                <span key={index} className="flex items-center">
                    {item.href ? (
                        <a href={item.href} className="hover:text-gray-900 transition-colors">{item.label}</a>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                    {index < items.length - 1 && <span className="mx-2">/</span>}
                </span>
            ))}
        </nav>
    );
}
