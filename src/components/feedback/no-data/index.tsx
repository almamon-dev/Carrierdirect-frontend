import React from 'react';

export interface NoDataProps {
    className?: string;
}

export default function NoData({ className }: NoDataProps) {
    return (
        <div className={className}>
            {/* NoData Component */}
        </div>
    );
}
