import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';

export interface ThemeSwitcherProps {
    className?: string;
    showText?: boolean;
}

export default function ThemeSwitcher({ className = '', showText = false }: ThemeSwitcherProps) {
    const { isDark, toggleTheme } = useThemeStore();

    return (
        <button
            onClick={toggleTheme}
            type="button"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer border shadow-2xs ${
                isDark
                    ? 'bg-[#1e2329] border-[#2b313a] text-amber-400 hover:bg-[#2b313a]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            } ${className}`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
                <Moon className="w-4 h-4 text-slate-600 shrink-0" />
            )}
            {showText && (
                <span className="text-xs font-medium">
                    {isDark ? 'Dark' : 'Light'}
                </span>
            )}
        </button>
    );
}
