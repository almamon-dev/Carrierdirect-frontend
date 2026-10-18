import React, { useMemo } from 'react';
import { WonQuoteItem, WonFilterTab } from '../types';

interface FilterTabsProps {
    quotes: WonQuoteItem[];
    activeTab: WonFilterTab;
    onSelectTab: (tab: WonFilterTab) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
    quotes,
    activeTab,
    onSelectTab,
}) => {
    // Exact spec: Confirmed | Driver Assigned | In Transit | Delivered | POD Pending | Completed
    const tabs = useMemo(() => {
        let confirmed = 0;
        let driverAssigned = 0;
        let inTransit = 0;
        let delivered = 0;
        let podPending = 0;
        let completed = 0;

        (quotes || []).forEach((q: any) => {
            const s = (q.deliveryStatus || q.status || q.order_status || '').toLowerCase().trim();
            if (s === 'completed' || s === 'finished') {
                completed++;
            } else if (s === 'pod pending' || s === 'pod_pending' || s === 'pod_uploaded' || s === 'pod review' || s === 'pod_review') {
                podPending++;
            } else if (s === 'delivered') {
                delivered++;
            } else if (s === 'in transit' || s === 'in_transit' || s === 'picked up' || s === 'picked_up') {
                inTransit++;
            } else if (s === 'driver assigned' || s === 'driver_assigned' || s === 'assigned') {
                driverAssigned++;
            } else {
                confirmed++;
            }
        });

        return [
            { id: 'Confirmed' as WonFilterTab, label: 'Confirmed', count: confirmed },
            { id: 'Driver Assigned' as WonFilterTab, label: 'Driver Assigned', count: driverAssigned },
            { id: 'In Transit' as WonFilterTab, label: 'In Transit', count: inTransit },
            { id: 'Delivered' as WonFilterTab, label: 'Delivered', count: delivered },
            { id: 'POD Pending' as WonFilterTab, label: 'POD Pending', count: podPending },
            { id: 'Completed' as WonFilterTab, label: 'Completed', count: completed },
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
