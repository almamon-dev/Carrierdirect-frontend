import React from 'react';

interface Props {
    activeTab: 'all' | 'active' | 'assigned' | 'delivered';
    counts: {
        all: number;
        active: number;
        assigned: number;
        delivered: number;
    };
    onTabChange: (tab: 'all' | 'active' | 'assigned' | 'delivered') => void;
}

export const ShipmentFilterTabs: React.FC<Props> = ({ activeTab, counts, onTabChange }) => {
    const tabs = [
        { id: 'all' as const, label: 'All Freight Loads', count: counts.all },
        { id: 'active' as const, label: 'Active / In-Transit', count: counts.active },
        { id: 'assigned' as const, label: 'Pending Pickup', count: counts.assigned },
        { id: 'delivered' as const, label: 'Delivered', count: counts.delivered },
    ];

    return (
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabChange(tab.id)}
                        className={`px-3 py-1.5 rounded-[4px] text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                            isActive
                                ? 'bg-[#FF4A1F] text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                    >
                        <span>{tab.label}</span>
                        <span
                            className={`px-1.5 py-0.2 text-[10px] font-bold rounded-[3px] ${
                                isActive
                                    ? 'bg-white/25 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
