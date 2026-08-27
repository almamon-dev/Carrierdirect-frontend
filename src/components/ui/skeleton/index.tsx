import React from 'react';

export interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function Skeleton({ className = '', style }: SkeletonProps) {
    const isFull = className.includes('rounded-full');
    const roundedClass = isFull ? 'rounded-full' : 'rounded-[2px]';
    return (
        <div className={`animate-live-shimmer ${roundedClass} ${className}`} style={style}></div>
    );
}
