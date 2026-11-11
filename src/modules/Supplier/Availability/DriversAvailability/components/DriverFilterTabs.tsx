import React from 'react';
import { DriverFilterStatus, DriverCounts } from '../types/driverAvailability.types';

export interface DriverFilterTabsProps {
    activeTab: DriverFilterStatus;
    onSelectTab: (tab: DriverFilterStatus) => void;
    counts: DriverCounts;
}

export function DriverFilterTabs({
    activeTab,
    onSelectTab,
    counts,
}: DriverFilterTabsProps) {
    const tabs: { id: DriverFilterStatus; label: string; count: number }[] = [
        { id: 'All', label: 'All Drivers', count: counts.all },
        { id: 'Available', label: 'Available', count: counts.available },
        { id: 'On Job', label: 'On Job', count: counts.on_job },
        { id: 'On Break', label: 'On Break', count: counts.break ?? 0 },
        { id: 'Offline', label: 'Offline', count: counts.offline ?? 0 },
        { id: 'Blocked', label: 'Blocked', count: counts.blocked ?? 0 },
    ];

    return (
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-1.5 pb-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 text-xs ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                        }`}
                    >
                        <span>{tab.label}</span>
                        <span>({tab.count})</span>
                    </button>
                );
            })}
        </div>
    );
}

export default DriverFilterTabs;
