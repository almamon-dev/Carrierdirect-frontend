import React from 'react';

export interface SeparatorProps {
    className?: string;
    orientation?: 'horizontal' | 'vertical';
}

export default function Separator({ className = '', orientation = 'horizontal' }: SeparatorProps) {
    return (
        <div className={`${orientation === 'horizontal' ? 'w-full h-[1px]' : 'h-full w-[1px]'} bg-gray-200 ${className}`} />
    );
}
