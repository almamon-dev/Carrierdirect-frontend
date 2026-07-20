import React from 'react';

export interface ActionBarProps {
    className?: string;
    children?: React.ReactNode;
}

export default function ActionBar({ className = '', children }: ActionBarProps) {
    return (
        <div className={`flex items-center justify-between p-4 bg-white border-b border-gray-200 ${className}`}>
            <div className="flex items-center space-x-2">
                {children}
            </div>
        </div>
    );
}
