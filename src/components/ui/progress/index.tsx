import React from 'react';

export interface ProgressProps {
    className?: string;
    value?: number;
}

export default function Progress({ className = '', value = 50 }: ProgressProps) {
    return (
        <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%` }}></div>
        </div>
    );
}
