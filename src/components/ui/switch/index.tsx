import React, { useState, useEffect } from 'react';

export interface SwitchProps {
    className?: string;
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
}

export default function Switch({
    className = '',
    defaultChecked = false,
    checked: checkedProp,
    onChange,
    onCheckedChange,
    disabled = false,
}: SwitchProps) {
    const [checked, setChecked] = useState(checkedProp !== undefined ? checkedProp : defaultChecked);

    useEffect(() => {
        if (checkedProp !== undefined) {
            setChecked(checkedProp);
        }
    }, [checkedProp]);

    const handleToggle = () => {
        if (disabled) return;
        const nextState = !checked;
        if (checkedProp === undefined) {
            setChecked(nextState);
        }
        if (onChange) onChange(nextState);
        if (onCheckedChange) onCheckedChange(nextState);
    };

    return (
        <button
            type="button"
            disabled={disabled}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#ff4a1f]' : 'bg-slate-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            onClick={handleToggle}
        >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
    );
}
