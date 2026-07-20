import React, { useState } from 'react';

export interface ThemeSwitcherProps {
    className?: string;
}

export default function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
    const [isDark, setIsDark] = useState(false);
    return (
        <button 
            onClick={() => setIsDark(!isDark)} 
            className={`p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors ${className}`}
            title="Toggle Theme"
        >
            {isDark ? '🌙' : '☀️'}
        </button>
    );
}
