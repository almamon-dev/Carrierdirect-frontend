import React from 'react';

export interface FormProviderProps {
    className?: string;
}

export default function FormProvider({ className }: FormProviderProps) {
    return (
        <div className={className}>
            {/* FormProvider Component */}
        </div>
    );
}
