import React, { useMemo } from 'react';
import { SupplierOrderItem } from '../../ActiveJobs/types';

export type AssignDriverFilterTab = 'all' | 'pending' | 'assigned' | 'in_transit' | 'completed';

interface AssignDriverFilterTabsProps {
    orders: SupplierOrderItem[];
    activeTab: AssignDriverFilterTab;
    onSelectTab: (tab: AssignDriverFilterTab) => void;
}

export const AssignDriverFilterTabs: React.FC<AssignDriverFilterTabsProps> = ({
    orders,
    activeTab,
    onSelectTab,
}) => {
    const tabs = useMemo(() => {
        let all = orders.length;
        let pending = 0;
        let assigned = 0;
        let in_transit = 0;
        let completed = 0;

        orders.forEach((o) => {
            const rawStatus = (o.status_raw || o.status || 'confirmed').toLowerCase().trim();
            const isAssigned = rawStatus === 'driver_assigned' || rawStatus === 'assigned';
            const isInTransit = rawStatus === 'in_transit' || rawStatus === 'picked_up' || rawStatus === 'in_progress';
            const isComp = rawStatus === 'completed' || rawStatus === 'delivered' || rawStatus === 'pod accepted';

            if (isComp) {
                completed++;
            } else if (isInTransit) {
                in_transit++;
            } else if (isAssigned) {
                assigned++;
            } else {
                pending++;
            }
        });

        return [
            { id: 'all' as AssignDriverFilterTab, label: 'All', count: all },
            { id: 'pending' as AssignDriverFilterTab, label: 'Pending', count: pending },
            { id: 'assigned' as AssignDriverFilterTab, label: 'Assigned', count: assigned },
            { id: 'in_transit' as AssignDriverFilterTab, label: 'In Transit', count: in_transit },
            { id: 'completed' as AssignDriverFilterTab, label: 'Completed', count: completed },
        ];
    }, [orders]);

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
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

export default AssignDriverFilterTabs;
