import React, { useState } from 'react';

export interface TooltipProps {
    className?: string;
    text?: string;
    children?: React.ReactNode;
}

export default function Tooltip({ className = '', text = 'Tooltip Info', children = <span className="underline cursor-help">Hover me</span> }: TooltipProps) {
    const [show, setShow] = useState(false);
    return (
        <div className={`relative inline-block ${className}`} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            {show && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-30">
                    {text}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
        </div>
    );
}
