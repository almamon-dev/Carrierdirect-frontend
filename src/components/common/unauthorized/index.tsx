import React from 'react';

export interface UnauthorizedProps {
    className?: string;
}

export default function Unauthorized({ className = '' }: UnauthorizedProps) {
    return (
        <div className={`min-h-[400px] flex flex-col items-center justify-center text-center px-4 ${className}`}>
            <div className="text-6xl mb-4">⛔</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500 max-w-md">You do not have permission to view this page or perform this action.</p>
        </div>
    );
}
