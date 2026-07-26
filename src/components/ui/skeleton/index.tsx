import React from 'react';

export interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function Skeleton({ className = '', style }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} style={style}></div>
    );
}
