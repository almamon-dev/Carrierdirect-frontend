import React, { useState } from 'react';

export interface DropdownProps {
    className?: string;
    label?: string;
    items?: string[];
}

export default function Dropdown({ className = '', label = 'Options', items = ['Option 1', 'Option 2'] }: DropdownProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`relative ${className}`}>
            <button onClick={() => setOpen(!open)} className="px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50">
                {label} ▼
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                    {items.map((item, i) => (
                        <div key={i} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => setOpen(false)}>{item}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
