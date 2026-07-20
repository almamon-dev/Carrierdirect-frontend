import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    const sizeMap = {
        sm: 14,
        md: 20,
        lg: 28,
    };

    return (
        <Loader2 
            size={sizeMap[size]} 
            className={`animate-spin text-[#008060] ${className}`} 
        />
    );
}
