import React from 'react';
import { MapSkeletonPlaceholder } from './MapSkeletonPlaceholder';

export const NavigationPageSkeleton: React.FC = () => {
    return (
        <div className="fixed inset-0 w-screen h-screen z-50 bg-slate-950 flex flex-col font-sans select-none overflow-hidden">
            {/* 1. Header Skeleton */}
            <header className="h-12 bg-[#161B22] border-b border-slate-800 flex items-center justify-between px-3 sm:px-4 shrink-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-16 bg-slate-800 rounded-[5px] animate-pulse" />
                    <div className="h-4 w-px bg-slate-800" />
                    <div className="h-4 w-28 bg-slate-800 rounded-[4px] animate-pulse" />
                    <div className="h-4 w-24 bg-emerald-950/60 border border-emerald-500/20 rounded-[4px] animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-7 w-28 bg-slate-800 rounded-[5px] animate-pulse" />
                    <div className="h-7 w-32 bg-[#FF5722]/30 rounded-[5px] animate-pulse" />
                </div>
            </header>

            {/* 2. Map Container with MapSkeletonPlaceholder */}
            <main className="flex-1 w-full h-[calc(100vh-48px)] relative bg-slate-950 overflow-hidden">
                <MapSkeletonPlaceholder
                    height="100%"
                    message="Initializing Turn-by-Turn Navigation..."
                    showDetails={false}
                />

                {/* 3. Top Green Turn-by-Turn HUD Skeleton */}
                <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-30 pointer-events-none">
                    <div className="bg-[#15803D]/90 p-3 rounded-[5px] shadow-lg border border-emerald-500/40 flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-[5px] bg-emerald-900/80 border border-emerald-400/30 flex items-center justify-center shrink-0" />
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="h-3 w-20 bg-emerald-300/40 rounded-[3px]" />
                            <div className="h-4 w-48 bg-white/70 rounded-[3px]" />
                            <div className="h-2.5 w-36 bg-emerald-200/40 rounded-[3px]" />
                        </div>
                    </div>
                </div>

                {/* 4. Speedometer HUD Skeleton (Floating Left) */}
                <div className="absolute bottom-24 left-3 sm:left-4 z-30 pointer-events-none">
                    <div className="bg-[#161B22]/95 border border-slate-800 rounded-[5px] p-2 px-3 shadow-lg flex flex-col items-center min-w-[68px] space-y-1 animate-pulse">
                        <div className="h-2 w-10 bg-slate-700 rounded-[2px]" />
                        <div className="h-6 w-10 bg-slate-600 rounded-[3px]" />
                        <div className="h-2 w-7 bg-emerald-500/40 rounded-[2px]" />
                    </div>
                </div>

                {/* 5. Bottom Navigation HUD Skeleton */}
                <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 max-w-2xl mx-auto z-30 pointer-events-none">
                    <div className="bg-[#161B22]/95 border border-slate-800 p-3 sm:p-3.5 rounded-[5px] shadow-2xl flex items-center justify-between gap-3 animate-pulse">
                        <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="h-6 w-24 bg-[#FF5722]/30 rounded-[4px]" />
                            <div className="h-3 w-40 bg-slate-700 rounded-[3px]" />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 rounded-[5px] bg-slate-800" />
                            <div className="w-8 h-8 rounded-[5px] bg-slate-800" />
                            <div className="w-14 h-8 rounded-[5px] bg-red-950/60" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NavigationPageSkeleton;

