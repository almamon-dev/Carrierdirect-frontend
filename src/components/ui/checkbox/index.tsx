import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export default function Checkbox({ label, className = '', id, ...props }: CheckboxProps) {
    const checkboxId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <input
                id={checkboxId}
                type="checkbox"
                className="w-4 h-4 text-[#FF4A1F] border-[#d1d1d1] rounded-[2px] focus:ring-[#FF4A1F] cursor-pointer"
                {...props}
            />
            {label && (
                <label htmlFor={checkboxId} className="text-[13px] text-[#202223] cursor-pointer select-none">
                    {label}
                </label>
            )}
        </div>
    );
}
