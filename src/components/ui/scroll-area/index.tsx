import React from 'react';

export interface ScrollAreaProps {
    className?: string;
    children?: React.ReactNode;
}

export default function ScrollArea({ className = '', children }: ScrollAreaProps) {
    return (
        <div className={`overflow-auto border rounded-md p-4 ${className}`}>
            {children || <div className="h-[200px]">Scrollable content goes here...</div>}
        </div>
    );
}
