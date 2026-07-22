import React, { useState } from 'react';

export interface NotificationMenuProps {
    className?: string;
    unreadCount?: number;
}

export default function NotificationMenu({ className = '', unreadCount = 3 }: NotificationMenuProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`relative ${className}`}>
            <button onClick={() => setOpen(!open)} className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <span>🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-50 p-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2 mb-2">Notifications</h3>
                    <div className="text-sm text-gray-600 py-2 border-b">New user registered</div>
                    <div className="text-sm text-gray-600 py-2 border-b">System update completed</div>
                    <div className="text-sm text-gray-600 py-2">Invoice #1024 paid</div>
                </div>
            )}
        </div>
    );
}
