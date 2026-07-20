import React, { useState } from 'react';

export interface LanguageSwitcherProps {
    className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
    const [open, setOpen] = useState(false);
    const langs = ['English', 'Bengali', 'Spanish'];
    const [current, setCurrent] = useState(langs[0]);

    return (
        <div className={`relative ${className}`}>
            <button onClick={() => setOpen(!open)} className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                <span>🌐 {current}</span>
                <span className="text-xs">▼</span>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50">
                    {langs.map(lang => (
                        <div key={lang} onClick={() => { setCurrent(lang); setOpen(false); }} className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                            {lang}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
