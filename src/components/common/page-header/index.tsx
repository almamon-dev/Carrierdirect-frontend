import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
    className?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    badge?: React.ReactNode;
    children?: React.ReactNode;
    actions?: React.ReactNode;
}

export default function PageHeader({
    className = '',
    title = 'Page Title',
    description,
    badge,
    children,
    actions
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6", className)}>
            <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                    {typeof title === 'string' ? (
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            {title}
                        </h1>
                    ) : (
                        title
                    )}
                    {badge}
                </div>
                {description && (
                    <div className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {description}
                    </div>
                )}
            </div>
            {(children || actions) && (
                <div className="flex items-center gap-2 shrink-0">
                    {actions}
                    {children}
                </div>
            )}
        </div>
    );
}
