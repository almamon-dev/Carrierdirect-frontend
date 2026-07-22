import React from 'react';

export interface CommandProps {
    className?: string;
}

export default function Command({ className = '' }: CommandProps) {
    return (
        <div className={`border rounded-md shadow-sm bg-white overflow-hidden ${className}`}>
            <div className="flex items-center px-3 py-2 border-b">
                <span className="text-gray-400 mr-2">🔍</span>
                <input type="text" placeholder="Type a command or search..." className="w-full outline-none text-sm" />
            </div>
            <div className="p-2 text-sm text-gray-500">
                No results found.
            </div>
        </div>
    );
}
