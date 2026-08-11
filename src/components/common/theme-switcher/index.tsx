import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';

export interface ThemeSwitcherProps {
    className?: string;
    showText?: boolean;
    variant?: 'default' | 'hero';
}

export default function ThemeSwitcher({ className = '', showText = false, variant = 'default' }: ThemeSwitcherProps) {
    const { isDark, toggleTheme } = useThemeStore();

    const trackCls = isDark
        ? 'bg-[#181d24] border-[#2e3642] hover:border-slate-600'
        : variant === 'hero'
        ? 'bg-white/20 border-white/40 hover:border-white/70'
        : 'bg-slate-200/80 border-slate-300 hover:border-slate-400';

    return (
        <div className={`inline-flex items-center gap-2.5 ${className}`}>
            <button
                onClick={toggleTheme}
                type="button"
                className={`relative w-[54px] h-[30px] rounded-full p-[3px] transition-all duration-300 cursor-pointer border flex items-center shrink-0 shadow-inner ${trackCls}`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
            >
                {/* Sliding knob */}
                <div
                    className={`w-[22px] h-[22px] rounded-full flex items-center justify-center transition-transform duration-300 transform shadow-md ${
                        isDark
                            ? 'translate-x-[24px] bg-[#22c55e] text-white'
                            : 'translate-x-0 bg-[#fbc02d] text-[#0f0400]'
                    }`}
                >
                    {isDark ? (
                        <Moon className="w-3.5 h-3.5 text-white fill-white shrink-0" />
                    ) : (
                        <Sun className="w-3.5 h-3.5 text-[#0f0400] fill-[#0f0400] shrink-0" />
                    )}
                </div>
            </button>
            {showText && (
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
            )}
        </div>
    );
}
