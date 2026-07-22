import React, { useState } from 'react';

export interface UserMenuProps {
    className?: string;
    user?: { name: string; email: string; avatar?: string };
}

export default function UserMenu({ className = '', user = { name: 'John Doe', email: 'john@example.com' } }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`relative ${className}`}>
            <button onClick={() => setOpen(!open)} className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 py-1">
                    <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <div className="border-t my-1"></div>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign out</button>
                </div>
            )}
        </div>
    );
}
