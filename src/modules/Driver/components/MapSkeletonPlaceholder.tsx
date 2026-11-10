import React from 'react';

interface MapSkeletonPlaceholderProps {
    height?: string | number;
    className?: string;
    message?: string;
    showDetails?: boolean;
}

export const MapSkeletonPlaceholder: React.FC<MapSkeletonPlaceholderProps> = ({
    height = '100%',
    className = '',
    message = 'Synchronizing Live Route Map...',
    showDetails = true,
}) => {
    return (
        <div
            style={{ height }}
            className={`w-full relative rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#12161c] overflow-hidden select-none font-sans ${className}`}
        >
            {/* 1. Vector Map Grid & Simulated Road Curves */}
            <svg
                className="absolute inset-0 w-full h-full opacity-40 dark:opacity-25"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <defs>
                    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-slate-300 dark:text-slate-800" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                {/* Simulated Road Lines */}
                <path
                    d="M -20,120 Q 180,60 360,140 T 700,90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-slate-300/80 dark:text-slate-700/60"
                />
                <path
                    d="M 60,-20 Q 140,160 220,380"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-slate-300/80 dark:text-slate-700/60"
                />
                <path
                    d="M 120,40 C 260,80 340,240 520,220"
                    fill="none"
                    stroke="#FF5722"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    className="opacity-40 animate-pulse"
                />
            </svg>

            {/* 2. Animated Shimmer Light Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent animate-shimmer pointer-events-none" />

            {/* 3. Skeleton Pickup Pin & Delivery Pin Placeholders */}
            <div className="absolute top-12 left-10 flex items-center gap-2 pointer-events-none animate-pulse">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="h-3.5 w-24 bg-slate-300/80 dark:bg-slate-700 rounded-[3px]" />
            </div>

            <div className="absolute bottom-16 right-12 flex items-center gap-2 pointer-events-none animate-pulse">
                <div className="h-3.5 w-28 bg-slate-300/80 dark:bg-slate-700 rounded-[3px]" />
                <div className="w-7 h-7 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shadow-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                </div>
            </div>

            {/* 4. Top-Left Floating Skeleton Card */}
            {showDetails && (
                <div className="absolute top-3 left-3 w-56 sm:w-64 bg-white/95 dark:bg-[#1a2027]/95 border border-slate-200 dark:border-slate-800 rounded-[5px] p-2.5 shadow-sm space-y-2 pointer-events-none animate-pulse">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded-[3px]" />
                    </div>
                    <div className="h-2.5 w-44 bg-slate-100 dark:bg-slate-800 rounded-[3px] ml-4" />
                    <div className="w-[1px] h-2 bg-slate-200 dark:bg-slate-700 ml-1" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded-[3px]" />
                    </div>
                </div>
            )}

            {/* 5. Center Status Pill Badge (5px radius, with pulsing emerald dot - NO SPINNER) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-3">
                <div className="bg-white/95 dark:bg-[#1e2329]/95 backdrop-blur-xs px-3.5 py-2 rounded-[5px] border border-slate-200/90 dark:border-slate-700/80 shadow-md flex items-center gap-2 animate-in fade-in duration-200">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                        {message}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MapSkeletonPlaceholder;

