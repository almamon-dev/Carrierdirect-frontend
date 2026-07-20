import React, { useState } from 'react';

export interface PopoverProps {
    className?: string;
    trigger?: React.ReactNode;
    content?: React.ReactNode;
}

export default function Popover({ className = '', trigger = <button className="px-4 py-2 bg-gray-100 rounded">Trigger</button>, content = <div className="p-4">Popover Content</div> }: PopoverProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`relative inline-block ${className}`}>
            <div onClick={() => setOpen(!open)}>{trigger}</div>
            {open && (
                <div className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg z-20 min-w-[200px]">
                    {content}
                </div>
            )}
        </div>
    );
}
