import React, { useMemo } from 'react';
import { CustomerWonQuoteItem, WonFilterTab } from '../types';

interface FilterTabsProps {
    quotes: CustomerWonQuoteItem[];
    activeTab: WonFilterTab;
    onSelectTab: (tab: WonFilterTab) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
    quotes,
    activeTab,
    onSelectTab,
}) => {
    // Quote History Tabs: Booked | Completed | Declined | Expired
    const tabs = useMemo(() => {
        let booked = 0;
        let completed = 0;
        let declined = 0;
        let expired = 0;

        (quotes || []).forEach((q: any) => {
            const h = q.historyStatus || q.status;
            if (h === 'Completed') {
                completed++;
            } else if (h === 'Booked') {
                booked++;
            } else if (h === 'Declined') {
                declined++;
            } else if (h === 'Expired') {
                expired++;
            }
        });

        return [
            { id: 'Booked' as WonFilterTab, label: 'Booked', count: booked },
            { id: 'Completed' as WonFilterTab, label: 'Completed', count: completed },
            { id: 'Declined' as WonFilterTab, label: 'Declined', count: declined },
            { id: 'Expired' as WonFilterTab, label: 'Expired', count: expired },
        ];
    }, [quotes]);

    return (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${
                                isActive
                                    ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
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
