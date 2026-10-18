import React from 'react';
import { DriverFilterStatus, DriverCounts } from '../types/driverAvailability.types';

interface DriverFilterTabsProps {
    activeTab: DriverFilterStatus;
    onSelectTab: (tab: DriverFilterStatus) => void;
    counts: DriverCounts;
}

export const DriverFilterTabs: React.FC<DriverFilterTabsProps> = ({
    activeTab,
    onSelectTab,
    counts,
}) => {
    const tabs: { id: DriverFilterStatus; label: string; count: number }[] = [
        { id: 'All', label: 'All', count: counts.all },
        { id: 'Available', label: 'Active', count: counts.available + counts.on_job },
        { id: 'Unavailable', label: 'Inactive', count: counts.unavailable },
    ];

    return (
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-1 pb-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1.5 text-xs ${
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
};

export default DriverFilterTabs;
