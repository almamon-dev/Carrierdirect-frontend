import React from 'react';

export interface BreadcrumbHeaderProps {
    className?: string;
    title?: string;
    breadcrumbs?: { label: string; href?: string }[];
}

export default function BreadcrumbHeader({ className = '', title = 'Page Title', breadcrumbs = [] }: BreadcrumbHeaderProps) {
    return (
        <div className={`mb-6 ${className}`}>
            <nav className="flex text-sm text-gray-500 mb-2">
                {breadcrumbs.map((item, index) => (
                    <span key={index} className="flex items-center">
                        {item.href ? (
                            <a href={item.href} className="hover:text-gray-900 transition-colors">{item.label}</a>
                        ) : (
                            <span className="text-gray-900 font-medium">{item.label}</span>
                        )}
                        {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                    </span>
                ))}
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
    );
}
