import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    fallback: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ src, fallback, size = 'md', className = '', ...props }: AvatarProps) {
    const sizeClasses = {
        sm: "w-6 h-6 text-[10px]",
        md: "w-8 h-8 text-[12px]",
        lg: "w-12 h-12 text-[16px]",
    };

    return (
        <div 
            className={`rounded-full bg-[#e4f1ef] text-[#008060] flex items-center justify-center font-bold overflow-hidden ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {src ? (
                <img src={src} alt={fallback} className="w-full h-full object-cover" />
            ) : (
                <span>{fallback.substring(0, 2).toUpperCase()}</span>
            )}
        </div>
    );
}
