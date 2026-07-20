import React from 'react';

export interface FilterBarProps {
    className?: string;
    children?: React.ReactNode;
}

export default function FilterBar({ className = '', children }: FilterBarProps) {
    return (
        <div className={`flex items-center space-x-4 p-4 bg-gray-50 rounded-md border border-gray-200 ${className}`}>
            <span className="text-sm font-medium text-gray-600">Filters:</span>
            {children || <div className="text-sm text-gray-400">No filters applied</div>}
        </div>
    );
}
