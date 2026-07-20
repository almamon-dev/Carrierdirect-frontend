import React, { useState } from 'react';

export interface SwitchProps {
    className?: string;
    defaultChecked?: boolean;
}

export default function Switch({ className = '', defaultChecked = false }: SwitchProps) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <button
            type="button"
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#008060]' : 'bg-slate-200'} ${className}`}
            onClick={() => setChecked(!checked)}
        >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
    );
}
