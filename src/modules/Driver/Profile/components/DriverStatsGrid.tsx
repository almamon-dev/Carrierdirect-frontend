import React from 'react';
import { Star } from 'lucide-react';
import { DriverProfile } from '../../types';

interface Props {
    stats: DriverProfile['stats'];
}

export const DriverStatsGrid: React.FC<Props> = ({ stats }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-4 shadow-2xs">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
                {/* 1. Active Loads */}
                <div className="p-2 sm:px-3 text-center">
                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tabular-nums">
                        {stats.activeLoads}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        Active Loads
                    </div>
                </div>

                {/* 2. Today's Orders */}
                <div className="p-2 sm:px-3 text-center">
                    <div className="text-lg sm:text-xl font-black text-[#FF4A1F] dark:text-orange-400 tabular-nums">
                        {stats.todayOrders}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        Today's Orders
                    </div>
                </div>

                {/* 3. Distance */}
                <div className="p-2 sm:px-3 text-center">
                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tabular-nums">
                        {stats.distanceKm} <span className="text-xs font-semibold text-slate-400">km</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        Distance
                    </div>
                </div>

                {/* 4. Rating */}
                <div className="p-2 sm:px-3 text-center">
                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1 tabular-nums">
                        <span>{stats.rating.toFixed(2)}</span>
                        <Star size={14} className="fill-amber-400 text-amber-400 inline mb-0.5" />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        Rating
                    </div>
                </div>
            </div>
        </div>
    );
};
